import { removeEmptyTags, removeITagsAndPreserveText, checkParentNode, removeEmptyNodes } from "./italic_funcs.js";

/********************************/
//   multiLineCreatingItag 함수 //
/********************************/
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
    let startNodeDiv;

    Array.from( selectedContent.childNodes ).forEach(( node, idx ) => {
        
        if( idx === 0 ) { //추출한 첫 번째 노드

            let iTag = transInnerNode( node );
            newStartNode.childNodes[0].appendChild( iTag );
            // removeEmptyNodes( newStartNode )
            // removeEmptyTags( newStartNode );
            startRangeNode = iTag;
            newRange = document.createRange();
            newRange.setStartBefore( startRangeNode );
            
        } else {
            
            if( idx !== lastIndex ) {

                let clone = node.cloneNode( true );
                let convertItag = transInnerNode( node );

                while( clone.firstChild ) { clone.removeChild( clone.firstChild )}
                
                clone.appendChild( convertItag );
                fragment.appendChild( clone );
                

            } else {

                removeITagsAndPreserveText( node );
                node.normalize();
                console.log('node: ', node );
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

        
        // clone.appendChild( convertItag );
        // fragment.appendChild( clone );
        // newStartNode.insertBefore( fragment, newStartNode.childNodes[newStartOffset] );

        // let wrapper = document.createDocumentFragment();
        // let clone = node.cloneNode( true );
        // let iTag = document.createElement('i');

        // if( lastIndex !== idx ) {

        //     while( clone.firstChild ) {
        //         wrapper.appendChild( clone.firstChild );
        //     }

        //     iTag.appendChild( wrapper );
        //     console.log('iTag: ', iTag );
            
        //     clone.appendChild( iTag );
        //     fragment.appendChild( clone );

        // } 
            
        // if( lastIndex === idx ) {

        //     removeITagsAndPreserveText( node );
        //     node.normalize();

        //     if ( node.nodeType === Node.ELEMENT_NODE && ( node.nodeName === 'DIV' || node.nodeName === 'P')) {
                
        //         // 마지막 노드 병합 로직
        //         let transItagNode = transInnerNode( node );
        //         let nextElement = endNodeParent;
        //         if( nextElement.firstChild ) nextElement.insertBefore( transItagNode, nextElement.firstChild );

        //         // removeEmptyTags( nextElement );
        //         nextElement.normalize();
        //         endRangeNode = transItagNode;

        //     }

        // }

    });

    newStartNode.insertBefore( fragment, newStartNode.childNodes[newStartOffset] );
    // newRange.setEndAfter( endRangeNode );
    // selection.removeAllRanges();
    // selection.addRange( newRange );

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