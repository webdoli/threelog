export function toggleItalic () {

    let selection = window.getSelection();
    if (!selection.rangeCount) return;  

    let selectedText = selection.toString();
    
    let range = selection.getRangeAt(0);
    let selectedContent = range.extractContents();
    let startNode = range.startContainer;
    let startOffset = range.startOffset;  //첫째행, 첫째줄을 의미
    let lastIndex = selectedContent.childNodes.length - 1;
    console.log('selectedContent Parent: ', selection.anchorNode.parentElement );
    // console.log('선택된 텍스트 구문에 존재하는 i 개수: ', selectedContent.querySelectorAll('i').length );
    
    // let selectedAreaTextChk = (selectedContent.childNodes[0].nodeType === Node.TEXT_NODE) ? true : false;
    // console.log('시작점 노드네임: ', selectedContent.childNodes[0].nodeName )
    let selectedContentsTagLen = selectedContent.childNodes.length;
    let chkLastTagItalic = selectedContent.childNodes[selectedContentsTagLen-1].tagName;
    console.log('마지막 태그: ', chkLastTagItalic )
    // selectedContent.childNodes.forEach( node => {
    //     if( node.nodeType === Node.ELEMENT_NODE && node.tagName === 'I' ) {
    //         console.log('시작점 i로 시작함');
    //     }
    // });
    let lowerElementEM = ( selectedContent.querySelectorAll('i').length > 0 ) ? true : false;
    // let includeItalic = ( lowerElementEM && )
    // let startElementText = ( lowerElementEM && selectedAreaTextChk ) ? true : false;
    let upperElementTagName = ( selection.anchorNode.parentElement.tagName === 'I' ) ? true : false;
    // let upperElementTagName = selection.anchorNode.parentElement.tagName;
    let commonAncestor = range.commonAncestorContainer;
    let element = commonAncestor.nodeType === 1 ? commonAncestor : commonAncestor.parentNode;
    console.log('commonAncestor: ', commonAncestor );
    let currentTagName = element;
    // const lowerElementEM =  selection.anchorNode.parentElement.querySelector('i');
    let upperNodeItalicCHK = ( upperElementTagName === 'I') ? true : false;
    console.log('선택한 부분 상위 태그이름: ', upperElementTagName );
    console.log('선택한 부분 하위 태그: ', lowerElementEM );
    let fragment = document.createDocumentFragment();
    let multiSLC = ( selectedText.split('\n').length > 1 ) ? true : false; //여러줄 선택 or 한줄 선택
    // let multiChk = selectedText.split('\n');
    let surroundingItalicTag = ( chkItalicExisting( selectedContent ) ) ? true : false;
    console.log('이텔릭 태그 감쌌음? ', surroundingItalicTag )
    

    if( !multiSLC ) {
        //한줄 선택
        console.log('한줄 선택');
        
        // ** 하위태그: em(x), 상위태그:em(x) :: 최초 이탤릭체 지정
        if ( !upperNodeItalicCHK && !lowerElementEM ) {
            
            
            console.log('현재 태그: ', currentTagName )
            console.log('x x');
            console.log('selectedContent i찾기: ', selectedContent.querySelectorAll('*') );
            

            let textNode = document.createTextNode( selectedText );
            let wrapper = document.createDocumentFragment();
            let italicEl = document.createElement('i');
            italicEl.appendChild( textNode );
            wrapper.appendChild( italicEl );

            range.insertNode( wrapper );
            
        }

        // ** 이탤릭체 삭제
        if( !upperNodeItalicCHK && lowerElementEM ) {
            // const selection = window.getSelection();
            // if (!selection.rangeCount) return;
            console.log('selectedContent i찾기: ', selectedContent.querySelectorAll('*') );
            if( chkLastTagItalic === 'I' ) {
                let parentNode = selection.anchorNode.parentElement;
                // const range = selection.getRangeAt(0);
                // const selectedContent = range.extractContents();
                console.log('현재 태그: ', currentTagName )
                console.log('x o')
                // selection.anchorNode.parentElement.remove();
                console.log('selection.anchorNode.parentElement: ', selection.anchorNode.parentElement );
                console.log('selectedContent: ', selectedContent );
                console.log('text: ', selectedContent.textContent );
                let textNode = document.createTextNode( selectedContent.textContent );
                let wrapper = document.createDocumentFragment();
                wrapper.appendChild( textNode );
                range.insertNode( wrapper );
                parentNode.normalize();
                console.log( 'parentNode: ', parentNode );
                // .normalize();
                // 선택사항
                // selection.removeAllRanges(); // 기존 선택 범위를 제거
                // const newRange = document.createRange(); // 새 범위 객체 생성
                // newRange.selectNode( selectedText ); // 새로운 텍스트 노드 선택
                // selection.addRange(newRange); // 새 범위를 선택 객체에 추가
                
                // selectedContent.parentNode.normalize();
            } else {
                let textNode = document.createTextNode( selectedText );
                let wrapper = document.createDocumentFragment();
                let italicEl = document.createElement('i');
                italicEl.appendChild( textNode );
                wrapper.appendChild( italicEl );

                range.insertNode( wrapper );
            }
            
        
        }

        // ** 하위태그: em(o), 상위태그:em(x) :: 이탤릭체 선택된 상태에서 더 넓게 블락 선택


        // ** 하위태그: em(o), 상위태그:em(o) :: 불가능
        


        
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

function chkItalicExisting ( content ) {

    const container = document.createElement('div');
    container.appendChild( content.cloneNode(true) );
    const htmlString = container.innerHTML;
    
    const regex = /^<i>.*<\/i>$/gs;
    const matches = htmlString.match( regex );

    return matches

}
