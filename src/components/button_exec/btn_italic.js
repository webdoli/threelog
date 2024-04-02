export function toggleItalic () {

    let selection = window.getSelection();
    if (!selection.rangeCount) return;  

    let selectedText = selection.toString();
    
    let range = selection.getRangeAt(0);
    let newRange;
    let startRangeNode;
    let endRangeNode;

    let selectedContent = range.extractContents();
    let startNode = range.startContainer;
    let startOffset = range.startOffset;  //첫째행, 첫째줄을 의미
    let lastIndex = selectedContent.childNodes.length - 1;

    let endNode = range.endContainer;
    let endOffset = range.endOffset;

    let fragment = document.createDocumentFragment();
    let multiSLC = ( selectedText.split('\n').length > 1 ) ? true : false; //여러줄 선택 or 한줄 선택
    // let multiChk = selectedText.split('\n');

    let surroundingItalicTag = ( chkItalicSurround( selectedContent ) ) ? true : false;
    let innerItalicTag = ( chkItalicInclude( selectedContent ) ) ? true : false;
    // console.log('이텔릭 시작 & 끝? ', surroundingItalicTag );
    // console.log('이텔릭 내부 존재: ', innerItalicTag );

    // console.log('범위 실행');
    setRange( selection, startNode, startOffset, endNode, endOffset );

    if( !multiSLC ) {
        //한줄 선택
        console.log('======== 한줄 선택 ========');
        
        // ** 최초 이탤릭체 지정: 둘러싼 i태그:(x), 하위 i태그:(x) 
        if ( !innerItalicTag && !surroundingItalicTag ) {
            
            console.log('최초 이탤릭체 지정');
            
            if( selectedText.trim().length > 0 ) {
                let textNode = document.createTextNode( selectedText );
                let wrapper = document.createDocumentFragment();
                let italicEl = document.createElement('i');
                italicEl.appendChild( textNode );
                wrapper.appendChild( italicEl );
                range.insertNode( wrapper );
            }
            
        } else if( surroundingItalicTag ) {
            // ** 이탤릭체 삭제: 둘러싼 i태그(o), 하위 i태그(있으나없으나 상관없음) 
            let hasTextNode = false;
            selectedContent.childNodes.forEach( node => {
                if( node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0 ) hasTextNode = true;
            });

            if( hasTextNode ) {

                selectedContent.childNodes.forEach( node => {
                    if( node.tagName !== 'I' ) {
                        
                        const wrapper = document.createElement('i');
                        wrapper.appendChild( node.cloneNode(true) );
                        node.parentNode.insertBefore( wrapper, node );
                        node.parentNode.removeChild( node );

                    }
                });
                
                range.insertNode( selectedContent );
                // removeEmptyITags(document.getElementById('text-editor'));
                return;

            } else {

                // let parentNode = selection.anchorNode.parentElement;
                let textNode = document.createTextNode( selectedContent.textContent );
                let wrapper = document.createDocumentFragment();
                wrapper.appendChild( textNode );
                range.insertNode( wrapper );
                // removeEmptyITags(document.getElementById('text-editor'));
                startNode.normalize();

            }
        
        } else {
    
            let proxyEl = document.createDocumentFragment();
            proxyEl.appendChild( selectedContent );

            let removeItalicResult = removeITagsAndPreserveText( proxyEl );
            let iTag = document.createElement('i');
            iTag.appendChild( removeItalicResult );
            
            iTag.normalize();
            range.insertNode( iTag );

        }

        removeEmptyTags( selectedContent )
        
    }

    if( multiSLC ) {
        //여러줄 선택
        console.log('======== 여러 줄 선택 ========');
        // i태그 포함(x), i태그 둘러쌈(x) >> i태그 둘러싸기
        let chkMulti_ItalicRemove = chkMultiLineItalicRemoved( selectedContent );
        // console.log( '이탤릭체 삭제가능: ' , chkMulti_ItalicRemove );
        // 마지막 부분 이텔릭인지 확인

        if( chkMulti_ItalicRemove ) {
            // 순환하며 이탤릭체 모두 삭제
            console.log('여러줄 이탤릭체 제거 실행');
            selectedContent.childNodes.forEach( tag => {
                removeITagsAndPreserveText( tag );
            })
            
            const firstNode = selectedContent.childNodes[0];
            console.log('firstNode: ', firstNode );
            Array.from( firstNode.childNodes ).forEach( node => {

                let wrapper = document.createDocumentFragment();
                let spanNode = document.createElement('span');
                let clone_ = node.cloneNode(true);
                let previousElement = startNode.childNodes[startOffset].previousSibling;
                wrapper.appendChild( clone_ );
                // tmpNode.appendChild( clone_ );
                previousElement.appendChild( wrapper );
                removeEmptyTag( previousElement );
                previousElement.normalize();

                startRangeNode = wrapper;

                // 새 선택범위 생성:시작점
                newRange = document.createRange();
                // 예외처리
                console.log('startRangeNode.nodeType: ', startRangeNode.nodeType );
                if( startRangeNode.nodeType !== 11 ) newRange.setStartBefore( startRangeNode );
                
                
                
            });

            Array.from( selectedContent.childNodes ).forEach( (node, idx) => {

                if( idx !== 0 ) {

                    let clone = node.cloneNode( true );

                    if( lastIndex !== idx ) {

                        fragment.appendChild( clone );
                        fragment.normalize();

                    } else {

                        const lastNode = selectedContent.childNodes[lastIndex];

                        if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
                            // 마지막 노드 병합 로직
                            Array.from( lastNode.childNodes ).forEach( node => {

                                let spanNode = document.createElement('span');
                                let wrapper = document.createDocumentFragment();
                                let nextElement = startNode.childNodes[startOffset];
                                let clone_ = node.cloneNode(true);
                                wrapper.appendChild( clone_ );
                                if( nextElement.firstChild ) nextElement.insertBefore( wrapper, nextElement.firstChild );
                                endRangeNode = wrapper;
                                removeEmptyTag( nextElement );
                                nextElement.normalize();

                                // 새 범위 생성: 마지막지점
                                if( startRangeNode.nodeType !== 11 ) {
                                    newRange.setEndAfter( endRangeNode );
                                    selection.removeAllRanges();
                                    selection.addRange( newRange );
                                }
                                
                                
                            })

                        }

                        range.collapse(false); // 범위를 끝점으로 이동

                    }
                } 

            });
            
            // 첫줄, 마지막줄 span노드 제거
            startNode.insertBefore( fragment, startNode.childNodes[startOffset]);
            
            console.log('이탤릭 제거')
            console.log('startRangeNode: ', startRangeNode );
            console.log('endRangeNode: ', endRangeNode );
            
            // let newRange = document.createRange();
            // newRange.setStartBefore( startRangeNode );
            // newRange.setEndAfter( endRangeNode );
            // selection.removeAllRanges();
            // selection.addRange( newRange );

            // removeSpanNode( endRangeNode );
            
            // range.insertNode( selectedContent );

        } else {
            // 순환하며 이탤릭체 씌우기
            console.log('여러줄 이탤릭체 씌우기 실행');
            const firstNode = selectedContent.childNodes[0];
            Array.from( firstNode.childNodes ).forEach( node => {

                let iTag = document.createElement('i');
                let previousElement = startNode.childNodes[startOffset].previousSibling;
                console.log('previousElement: ', previousElement );
                iTag.appendChild( node.cloneNode(true) );
                previousElement.appendChild( iTag );
                removeEmptyTag( previousElement );
                previousElement.normalize();

                // 새로운 블록범위 설정: 시작점
                startRangeNode = iTag;
                newRange = document.createRange();
                newRange.setStartBefore( startRangeNode );
                
            });

            

            Array.from(selectedContent.childNodes).forEach( (node, idx) => {

                if( idx !== 0 ) {

                    let fragEl = document.createDocumentFragment();
                    let iTag = document.createElement('i');
                    let clone = node.cloneNode( true );

                    if( lastIndex !== idx ) {

                        while( clone.firstChild ) {
                            fragEl.appendChild( clone.firstChild );
                        }

                        iTag.appendChild( fragEl );
                        clone.appendChild( iTag );
                        fragment.appendChild( clone );
                        

                    } else {

                        let lastNode = selectedContent.childNodes[lastIndex];
                        
                        removeITagsAndPreserveText( lastNode );
                        lastNode.normalize();
                        console.log('lastNode: ', lastNode )
                        if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
                            // 마지막 노드 병합 로직
                            Array.from( lastNode.childNodes ).forEach( node => {
                                
                                let iTag = document.createElement('i');
                                let nextElement = startNode.childNodes[startOffset];

                                iTag.appendChild( node.cloneNode(true) );
                                if( nextElement.firstChild ) nextElement.insertBefore( iTag, nextElement.firstChild );
            
                                removeEmptyTag( nextElement );
                                nextElement.normalize();

                                endRangeNode = iTag
                                // 새 범위 생성: 끝지점
                                newRange.setEndAfter( endRangeNode );
                                selection.removeAllRanges();
                                selection.addRange( newRange );
                            })

                        }

                        range.collapse(false); // 범위를 끝점으로 이동

                    }
                } 

            });

            startNode.insertBefore( fragment, startNode.childNodes[startOffset]);
            
            console.log('이탤릭 추가')
            console.log('startRangeNode: ', startRangeNode );
            console.log('endRangeNode: ', endRangeNode );

            // let newRange = document.createRange();
            // newRange.setStartBefore( startRangeNode );
            // newRange.setEndAfter( endRangeNode );
            // selection.removeAllRanges();
            // selection.addRange( newRange );


            // selection.removeAllRanges();
        
        }
        if( startRangeNode.nodeType === 11 ) { selection.removeAllRanges(); }
        

    }

    removeEmptyTags( selectedContent );
    // removeSpanNode( [startRangeNode, endRangeNode] );

}

const chkItalicSurround = ( content ) => { return createContainer( content ).match( /^<i>.*<\/i>$/gs ); }
const chkItalicInclude = ( content ) => { return createContainer( content ).match( /<i>.*?<\/i>/gs ); }
const chkItalicEnd = ( content ) => { return createContainer( content ).match( /<\/i>$/ ); };
const chkItalicStart = ( content ) => { return createContainer( content ).match( /^<i>/ ); }

function createContainer ( content ) {
    console.log('i태그 둘러싸임 체크 selectContented: ', content );
    const container = document.createElement('div');
    container.appendChild( content.cloneNode(true) );
    const htmlString = container.innerHTML;

    return htmlString

}

// 노드 아래 <i>태그만 찾아서 모두 삭제(텍스트는 유지)
function removeITagsAndPreserveText( parentNode ) {

    let res = parentNode
    const iTags = parentNode.querySelectorAll('i');

    iTags.forEach( iTag => {
        // `<i>` 태그의 모든 자식 노드를 순회하면서 부모 노드로 이동
        while (iTag.firstChild) {
            iTag.parentNode.insertBefore(iTag.firstChild, iTag);
        }

        // 모든 자식 노드 이동 후, `<i>` 태그 자체를 삭제
        iTag.parentNode.removeChild(iTag);
    });

    return res
}


// 여러줄일때, 첫번째 노드에 <i>가 있는지 유무 판단
function chkMultiLineItalicRemoved ( nodes ) {
    // console.log('nodes: ', nodes );
    let allNode = nodes.childNodes;
    let lastLen = allNode.length - 1;
    let lastNodeLen = allNode[lastLen].childNodes.length - 1;
    
    let firstNode = ( allNode[0].nodeType === Node.ELEMENT_NODE ) ? allNode[0].childNodes[0] : null;
    let lastNode = allNode[lastLen].childNodes[lastNodeLen];

    let removeItalic = false;
    let startEndItalic = false;
    
    // console.log('firstNode: ', firstNode );
    // console.log('lastNode: ', lastNode );
   
    if( firstNode ) {

        if( firstNode.nodeType === Node.ELEMENT_NODE && lastNode.nodeType === Node.ELEMENT_NODE )  { startEndItalic = true; }
        if( startEndItalic ) {
            // console.log('첫째줄 or 마지막줄 모두 Element임')
            if( firstNode.querySelectorAll('i') !== null && lastNode.querySelectorAll('i') !== null ) removeItalic = true;
        } 

        // console.log('removeItalic: ', removeItalic );
        // console.log('startEndItalic: ', startEndItalic );

        if( startEndItalic && removeItalic ) {

            nodes.childNodes.forEach( (node, idx) => {
                // 중간값 계산
                if( idx !== 0 && idx !== lastLen ) {
                    // 텍스트 노드가 하나라도 나오면 아웃 removeItalic = false
                    // console.log('중간 연산 node: ', node );
                    for( let i=0; i < node.childNodes.length; i++ ) {

                        if( removeItalic ) {

                            let tag = node.childNodes[i]; 

                            if( tag.nodeType !== Node.ELEMENT_NODE || tag.nodeType === Node.TEXT_NODE ) {
                            
                                removeItalic = false;
                                // console.log('텍스트노드 검출 removeItalic: ', removeItalic );
                                break;
                            
                            }
                            // 엘리먼트 노드 중에서 i가 없는게 하나라도 있으면 아웃 removeItalic = false
                            else if( tag.querySelectorAll('i') === null ) {
                            
                                removeItalic = false;
                                // console.log('i없는 노드 검출 removeItalic: ', removeItalic );
                                break;
                            } 
                            // 그외 i가 모두 존재 >> 이탤릭체 제거 removeItalic = true
                            else {
                            
                                removeItalic = true;
                                // console.log('이탤릭 삭제 가능 removeItalic: ', removeItalic )
                            }

                        }
                    
                    }

                }
            });

        }
    }
    

    // console.log('최종 removeItalic: ', removeItalic )
    return removeItalic

}

function applyItalic( node ) {
    if (!node) return; // 노드가 없는 경우 함수 종료
    if (node.nodeType === 3) { // 텍스트 노드
        const italic = document.createElement('i');
        italic.appendChild(document.createTextNode(node.textContent));
        node.parentNode.replaceChild(italic, node);
    } else {
        Array.from(node.childNodes).forEach(applyItalic);
    }
}

function removeEmptyTags( contents ) {

    contents.childNodes.forEach( node => {
        // console.log('빈껍데기 삭제: ', node );
        if( node.nodeType === Node.ELEMENT_NODE ) {
            node.querySelectorAll('*').forEach( element => {
                // 요소가 빈 태그인지 확인합니다. (textContent가 없고, 자식 요소도 없는 경우)
                if (!element.textContent.trim() && element.children.length === 0) {
                    // 빈 태그라면, 부모 요소로부터 해당 태그를 삭제합니다.
                    element.parentNode.removeChild(element);
                }
            });
        }
        

    })
    

}


function removeEmptyTag( container ) {

    const tags = container.querySelectorAll('*');
    
    tags.forEach( tag => {
        if ( tag.textContent.trim().length === 0) { // 텍스트가 없는 경우
            tag.parentNode.removeChild( tag );
        }
    });
}

function setRange ( selection, tag, newRange ) {

    // 새로운 Range 객체를 생성하고, 이전에 기록한 선택 범위로 설정합니다.
    newRange = document.createRange();
    newRange.selectNodeContents( tag );
    selection.removeAllRanges();
    selection.addRange( newRange );

}

function removeSpanNode( spanNode ) {
    
    Array.from( spanNode ).forEach( tag => {

        let textContent = tag.textContent;
        let iTag = document.createElement('i');
        let textNode = document.createTextNode( textContent );
        iTag.appendChild( textNode );
        let parent = tag.parentNode;

        parent.replaceChild( iTag, tag );
        parent.normalize();

    })
    // const textContent = spanNode.textContent;
    // const textNode = document.createTextNode( textContent );
    // const parent = spanNode.parentNode;
    
    // parent.replaceChild( textNode, spanNode );
    // parent.normalize();
}