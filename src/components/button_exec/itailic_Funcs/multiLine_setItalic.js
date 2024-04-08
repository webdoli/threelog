import { removeEmptyTags, removeITagsAndPreserveText, checkParentNode } from "./italic_funcs.js";

/********************************/
//   multiLineCreatingItag 함수 //
/********************************/
//:: <i>태그가 없는 여러줄에서 i태그 씌우기 
export function multiLineCreatingItag ( props ) {

    let { 
            range, selection, selectedContent, startNodeParent,
            endNodeParent, startRangeNode, endRangeNode
        } = props;
    console.log('startNodeParent (1): ', startNodeParent.parentNode );
    let fragment = document.createDocumentFragment();
    let newStartNode = range.startContainer;
    let newStartOffset = range.startOffset;
    const firstNode = ( selectedContent.childNodes[0] ) ? ( selectedContent.childNodes[0] ) : null;
    if( !firstNode ) return;

    let lastIndex = selectedContent.childNodes.length - 1;
    let newRange = document.createRange();
    let startNodeDiv;

    Array.from( selectedContent.childNodes ).forEach(( node, idx ) => {

        if( idx === 0 ) { //추출한 첫 번째 노드

            let tmpDiv = document.createElement('div');
            // let iTag = document.createElement('i');
            
            tmpDiv.innerHTML = node.cloneNode(true).innerHTML;
            console.log('tmpDiv: ', tmpDiv );
            // let container = document.createDocumentFragment();

            let iTag = transInnerNode( tmpDiv );
            startNodeDiv = checkParentNode( startNodeParent );
            startNodeDiv.parentNode.appendChild( iTag );
            startNodeDiv.parentNode.removeChild( startNodeDiv );
            startRangeNode = iTag;
            newRange = document.createRange();
            newRange.setStartBefore( startRangeNode );
            
        } else {

            let wrapper = document.createDocumentFragment();
            let clone = node.cloneNode( true );
            let iTag = document.createElement('i');

            if( lastIndex !== idx ) {

                while( clone.firstChild ) {
                    wrapper.appendChild( clone.firstChild );
                }

                iTag.appendChild( wrapper );
                clone.appendChild( iTag );
                fragment.appendChild( clone );

            } else if( lastIndex === idx ) {

                removeITagsAndPreserveText( node );
                node.normalize();

                if ( node.nodeType === Node.ELEMENT_NODE && ( node.nodeName === 'DIV' || node.nodeName === 'P')) {
                    
                    // 마지막 노드 병합 로직
                    let transItagNode = transInnerNode( node );
                    let nextElement = endNodeParent;
                    if( nextElement.firstChild ) nextElement.insertBefore( transItagNode, nextElement.firstChild );

                    // removeEmptyTags( nextElement );
                    nextElement.normalize();
                    endRangeNode = transItagNode;

                }

            }

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