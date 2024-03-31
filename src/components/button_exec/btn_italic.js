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
            
                let parentNode = selection.anchorNode.parentElement;
                let textNode = document.createTextNode( selectedContent.textContent );
                let wrapper = document.createDocumentFragment();
                wrapper.appendChild( textNode );
                range.insertNode( wrapper );
                removeEmptyITags(document.getElementById('text-editor'));
                parentNode.normalize();

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
        const firstNode = selectedContent.childNodes[0];

        Array.from( firstNode.childNodes ).forEach( node => {

            let emEl = document.createElement('em');
            let previousElement = startNode.childNodes[startOffset].previousSibling;
            emEl.appendChild( node.cloneNode(true) );
            previousElement.appendChild( emEl );

        })

        Array.from(selectedContent.childNodes).forEach( (node, idx) => {

            if( idx !== 0 ) {

                let fragEl = document.createDocumentFragment();
                let emEl = document.createElement('em');
                let clone = node.cloneNode( true );

                if( lastIndex !== idx ) {

                    while( clone.firstChild ) {
                        fragEl.appendChild( clone.firstChild );
                    }

                    emEl.appendChild( fragEl );
                    clone.appendChild( emEl );
                    fragment.appendChild( clone );

                } else {

                    const lastNode = selectedContent.childNodes[lastIndex];

                    if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
                        // 마지막 노드 병합 로직
                        Array.from( lastNode.childNodes ).forEach( node => {

                            let emEl = document.createElement('em');
                            let nextElement = startNode.childNodes[startOffset];

                            emEl.appendChild( node.cloneNode(true) );
                            if( nextElement.firstChild ) nextElement.insertBefore( emEl, nextElement.firstChild );

                        })

                    }

                    range.collapse(false); // 범위를 끝점으로 이동

                }
            } 

        });

        startNode.insertBefore( fragment, startNode.childNodes[startOffset]);
        selection.removeAllRanges();

    }

}

const chkItalicSurround = ( content ) => { return createContainer( content ).match( /^<i>.*<\/i>$/gs ); }
const chkItalicInclude = ( content ) => { return createContainer( content ).match( /<i>.*?<\/i>/gs ); }
const chkItalicEnd = ( content ) => { return createContainer( content ).match( /<\/i>$/ ); };
const chkItalicStart = ( content ) => { return createContainer( content ).match( /^<i>/ ); }

function createContainer ( content ) {

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


function removeEmptyITags(container) {
    const iTags = container.querySelectorAll('i');

    iTags.forEach(iTag => {
        if (iTag.textContent.trim().length === 0) { // 텍스트가 없는 경우
            iTag.parentNode.removeChild(iTag);
        }
    });
}
