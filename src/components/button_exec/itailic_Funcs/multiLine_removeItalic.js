import { removeEmptyTag,  removeITagsAndPreserveText } from "./italic_funcs.js";
// 순환하며 이탤릭체 모두 삭제

export function multiLineRemovingItag ( props ) {
    console.log('여러줄 이탤릭체 제거 실행');
    let { selectedContent,
        startNode,
        startOffset,
        startRangeNode,
        endRangeNode,
        selection,
        range
    } = props;

    selectedContent.childNodes.forEach( tag => {
        removeITagsAndPreserveText( tag );
    });

    let fragment = document.createDocumentFragment();
    const firstNode = selectedContent.childNodes[0];
    let lastIndex = selectedContent.childNodes.length - 1;
    let newRange;
    console.log('firstNode: ', firstNode );
    Array.from( firstNode.childNodes ).forEach( node => {
    
        let wrapper = document.createDocumentFragment();
        let spanNode = document.createElement('span');
        let clone_ = node.cloneNode(true);
        console.log('clone_: ', clone_ );
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

}