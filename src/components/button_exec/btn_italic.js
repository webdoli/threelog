export function toggleItalic () {

    let selection = window.getSelection();
    if (!selection.rangeCount) return;  

    let selectedText = selection.toString();
    
    let range = selection.getRangeAt(0);
    let selectedContent = range.extractContents();
    let startNode = range.startContainer;
    let startOffset = range.startOffset;  //첫째행, 첫째줄을 의미
    let lastIndex = selectedContent.childNodes.length - 1;
    
    let fragment = document.createDocumentFragment();
    let multiSLC = ( selectedText.split('\n').length > 1 ) ? true : false; //여러줄 선택 or 한줄 선택
    // let multiChk = selectedText.split('\n');

    let surroundingItalicTag = ( chkItalicSurround( selectedContent ) ) ? true : false;
    let innerItalicTag = ( chkItalicInclude( selectedContent ) ) ? true : false;
    console.log('이텔릭 시작 & 끝? ', surroundingItalicTag );
    console.log('이텔릭 내부 존재: ', innerItalicTag );

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
                removeEmptyITags(document.getElementById('text-editor'));
                return;

            } else {

                // let parentNode = selection.anchorNode.parentElement;
                let textNode = document.createTextNode( selectedContent.textContent );
                let wrapper = document.createDocumentFragment();
                wrapper.appendChild( textNode );
                range.insertNode( wrapper );
                removeEmptyITags(document.getElementById('text-editor'));
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
        
    }

    if( multiSLC ) {
        //여러줄 선택
        console.log('======== 여러 줄 선택 ========');
        // i태그 포함(x), i태그 둘러쌈(x) >> i태그 둘러싸기
        let chkMulti_ItalicRemove = chkMultiLineItalicRemoved( selectedContent );
        console.log( '이탤릭체 삭제가능: ' , chkMulti_ItalicRemove );
        // 마지막 부분 이텔릭인지 확인

        if( chkMultiLineItalicRemoved ) {
            // 순환하며 이탤릭체 모두 삭제


        } else {
            // 순환하며 이탤릭체 씌우기
            
        
        }

        // console.log('둘러싸여 있음? ', surroundingItalicTag );
        // console.log('내부 italic태그 있음? ', innerItalicTag );

        if( !surroundingItalicTag && !innerItalicTag ) {

            // let toMove = selectedContent.childNodes[0].childNodes[0];
            // let toEnd = selectedContent.childNodes[0].childNodes[selectedContent.childNodes[0].length];

            // let tmpRange = document.createRange();
            // tmpRange.setStartBefore( toMove );
            // tmpRange.setEndAfter( toEnd );
            
            // const extractNode = tmpRange.extractContents();
            // console.log('extractNode: ', extractNode );

            
            const firstNode = selectedContent.childNodes[0];

            Array.from( firstNode.childNodes ).forEach( node => {

                let iTag = document.createElement('i');
                let previousElement = startNode.childNodes[startOffset].previousSibling;
                iTag.appendChild( node.cloneNode(true) );
                previousElement.appendChild( iTag );

            })

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

                        const lastNode = selectedContent.childNodes[lastIndex];

                        if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
                            // 마지막 노드 병합 로직
                            Array.from( lastNode.childNodes ).forEach( node => {

                                let iTag = document.createElement('i');
                                let nextElement = startNode.childNodes[startOffset];

                                iTag.appendChild( node.cloneNode(true) );
                                if( nextElement.firstChild ) nextElement.insertBefore( iTag, nextElement.firstChild );

                            })

                        }

                        range.collapse(false); // 범위를 끝점으로 이동

                    }
                } 

            });

            startNode.insertBefore( fragment, startNode.childNodes[startOffset]);
            selection.removeAllRanges();

            

        
        } else if ( surroundingItalicTag ) {

            //이탤릭체 모두 삭제
            const firstNode = selectedContent.childNodes[0];

            Array.from( firstNode.childNodes ).forEach( node => {

                let removeTag = removeITagsAndPreserveText( node );
                console.log('removeTag: ', removeTag );
                let previousElement = startNode.childNodes[startOffset].previousSibling;
                previousElement.appendChild( removeTag );
                

            })

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

                        const lastNode = selectedContent.childNodes[lastIndex];

                        if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
                            // 마지막 노드 병합 로직
                            Array.from( lastNode.childNodes ).forEach( node => {

                                let iTag = document.createElement('i');
                                let nextElement = startNode.childNodes[startOffset];

                                iTag.appendChild( node.cloneNode(true) );
                                if( nextElement.firstChild ) nextElement.insertBefore( iTag, nextElement.firstChild );

                            })

                        }

                        range.collapse(false); // 범위를 끝점으로 이동

                    }
                } 

            });

            startNode.insertBefore( fragment, startNode.childNodes[startOffset]);
            selection.removeAllRanges();

        }

        // i태그 둘러쌈(o) >> i태그 있으면 모두 삭제하기
        // i태그 포함(o) >> i태그 내부 모두 삭제 후 둘러싸기

        

    }

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

    let allNode = nodes.childNodes;
    let lastLen = allNode.length - 1;
    let lastNodeLen = allNode[lastLen].childNodes.length - 1;
    
    let firstNode = allNode[0].childNodes[0];
    let lastNode = allNode[lastLen].childNodes[lastNodeLen];

    let removeItalic = false;
    let startEndItalic = false;
    
    console.log('firstNode: ', firstNode );
    console.log('lastNode: ', lastNode );
   
    if( firstNode.nodeType === Node.ELEMENT_NODE && lastNode.nodeType === Node.ELEMENT_NODE )  { startEndItalic = true; }
    if( startEndItalic ) {
        console.log('첫째줄 or 마지막줄 모두 Element임')
        if( firstNode.querySelectorAll('i') !== null && lastNode.querySelectorAll('i') !== null ) removeItalic = true;
    } 
    
    console.log('removeItalic: ', removeItalic );
    console.log('startEndItalic: ', startEndItalic );

    if( startEndItalic && removeItalic ) {

        nodes.childNodes.forEach( (node, idx) => {
            // 중간값 계산
            if( idx !== 0 && idx !== lastLen ) {
                // 텍스트 노드가 하나라도 나오면 아웃 removeItalic = false
                console.log('중간 연산 node: ', node );

                for( let i=0; i < node.childNodes.length; i++ ) {

                    if( removeItalic ) {

                        let tag = node.childNodes[i]; 

                        if( tag.nodeType !== Node.ELEMENT_NODE || tag.nodeType === Node.TEXT_NODE ) {
                        
                            removeItalic = false;
                            console.log('텍스트노드 검출 removeItalic: ', removeItalic );
                            break;
                        
                        }
                        // 엘리먼트 노드 중에서 i가 없는게 하나라도 있으면 아웃 removeItalic = false
                        else if( tag.querySelectorAll('i') === null ) {
                        
                            removeItalic = false;
                            console.log('i없는 노드 검출 removeItalic: ', removeItalic );
                            break;
                        } 
                        // 그외 i가 모두 존재 >> 이탤릭체 제거 removeItalic = true
                        else {
                        
                            removeItalic = true;
                            console.log('이탤릭 삭제 가능 removeItalic: ', removeItalic )
                        }

                    }
                    

                }

                // node.childNodes.forEach( tag => {

                //     if( tag.nodeType !== Node.ELEMENT_NODE || tag.nodeType === Node.TEXT_NODE ) {
                
                //         removeItalic = false;
                //         console.log('텍스트노드 검출 removeItalic: ', removeItalic )
                    
                //     }
                //     // 엘리먼트 노드 중에서 i가 없는게 하나라도 있으면 아웃 removeItalic = false
                //     else if( tag.querySelectorAll('i') === null ) {
    
                //         removeItalic = false;
                //         console.log('i없는 노드 검출 removeItalic: ', removeItalic )
                //     } 
                //     // 그외 i가 모두 존재 >> 이탤릭체 제거 removeItalic = true
                //     else {
    
                //         removeItalic = true;
                //         console.log('이탤릭 삭제 가능 removeItalic: ', removeItalic )
                //     }

                // })
                
            }
        });

    }

    console.log('최종 removeItalic: ', removeItalic )
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


function removeEmptyITags(container) {
    const iTags = container.querySelectorAll('i');

    iTags.forEach(iTag => {
        if (iTag.textContent.trim().length === 0) { // 텍스트가 없는 경우
            iTag.parentNode.removeChild(iTag);
        }
    });
}
