import { removeITagsAndPreserveText, transInnerNode, removeEmptyNodes } from "./italic_funcs.js";

//:: <i>태그가 없는 여러줄에서 i태그 씌우기 
export function multiLineCreatingItag ( props ) {

    let { 
            range, selection, selectedContent, startNode, startNodeParent,
            endNode, endNodeParent, startRangeNode, endRangeNode
        } = props;
    
    let fragment = document.createDocumentFragment();
    let newStartNode = range.startContainer;
    let newStartOffset = range.startOffset;
    
    let lastIndex = selectedContent.childNodes.length - 1;
    let newRange = document.createRange();

    Array.from( selectedContent.childNodes ).forEach(( node, idx ) => {
        
        if( idx === 0 ) { //추출한 첫 번째 노드

            let iTag = transInnerNode( node );
            newStartNode.childNodes[0].appendChild( iTag );
            startRangeNode = iTag;
            newRange.setStartBefore( startRangeNode );
            
        } else {
            
            if( idx !== lastIndex ) {

                let clone = node.cloneNode( true );
                let convertItag = transInnerNode( node );

                while( clone.firstChild ) { clone.removeChild( clone.firstChild )}
                
                clone.appendChild( convertItag );
                fragment.appendChild( clone );
                

            } else { // 마지막 노드 병합 로직

                removeITagsAndPreserveText( node );
                node.normalize();
                
                if ( node.nodeType === Node.ELEMENT_NODE && ( node.nodeName === 'DIV' || node.nodeName === 'P')) {
                    
                    let transItagNode = transInnerNode( node ); 
                    let nextElement = endNodeParent;
                    
                    if( nextElement.firstChild ) nextElement.insertBefore( transItagNode, nextElement.firstChild );

                    nextElement.normalize();
                    endRangeNode = transItagNode;

                }

            }
            
        }

    });
    
    newStartNode.insertBefore( fragment, newStartNode.childNodes[newStartOffset] );
    // console.log('endRangeNode: ', endRangeNode );
    newRange.setEndAfter( endRangeNode );
    selection.removeAllRanges();
    selection.addRange( newRange );

}