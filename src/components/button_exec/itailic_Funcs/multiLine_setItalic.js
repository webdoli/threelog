import { removeEmptyTags, removeITagsAndPreserveText, checkParentNode } from "./italic_funcs.js";

/********************************/
//   multiLineCreatingItag 함수 //
/********************************/
//:: <i>태그가 없는 여러줄에서 i태그 씌우기 
console.log('이탤릭 설정');
export function multiLineCreatingItag ( props ) {

    let { 
            range, selection, selectedContent, startNodeParent,
            endNodeParent, startRangeNode, endRangeNode
        } = props;
    
    let fragment = document.createDocumentFragment();
    let newStartNode = range.startContainer;
    let newStartOffset = range.startOffset;
    const firstNode = ( selectedContent.childNodes[0] ) ? ( selectedContent.childNodes[0] ) : null;
    if( !firstNode ) return;

    let lastIndex = selectedContent.childNodes.length - 1;
    let newRange = document.createRange();
    

    Array.from( selectedContent.childNodes ).forEach(( node, idx ) => {

        if( idx === 0 ) { //추출한 첫 번째 노드

            let tmpDiv = document.createElement('div');
            tmpDiv.innerHTML = node.cloneNode(true).innerHTML;

            let iTag = transInnerNode( tmpDiv );
            let startNodeDiv = checkParentNode( startNodeParent );
            startNodeDiv.parentNode.appendChild( iTag );
            startNodeDiv.parentNode.removeChild( startNodeDiv );
            startRangeNode = iTag;

            newRange = document.createRange();
            newRange.setStartBefore( startRangeNode );
            
        } else if( idx !== 0 && idx !== lastIndex) {

            let iTag = transInnerNode( node );
            clone.appendChild( iTag );
            fragment.appendChild( clone );

        } else {

            removeITagsAndPreserveText( node );
            node.normalize();

            // if ( node.nodeType === Node.ELEMENT_NODE && ( node.nodeName === 'DIV' || node.nodeName === 'P')) {
                
            //     // 마지막 노드 병합 로직
            //     let transItagNode = transInnerNode( node );
            //     let endNodeDiv = checkParentNode( endNodeParent );
            //     let nextElement = endNodeDiv.parentNode;

            //     if( nextElement.firstChild ) nextElement.insertBefore( transItagNode, nextElement.firstChild );
                
            //     removeEmptyTags( nextElement );
            //     nextElement.normalize();
            //     endRangeNode = transItagNode;
            // }

        }

    });

    newStartNode.insertBefore( fragment, newStartNode.childNodes[newStartOffset] );
    newRange.setEndAfter( endRangeNode );
    selection.removeAllRanges();
    selection.addRange( newRange );

}

function transInnerNode( node ) {

    let wrapper = document.createDocumentFragment();
    let clone = node.cloneNode( true );
    let iTag = document.createElement('i');

    while( clone.firstChild ) {
        wrapper.appendChild( clone.firstChild );
    }

    iTag.appendChild( wrapper );

    return iTag

}