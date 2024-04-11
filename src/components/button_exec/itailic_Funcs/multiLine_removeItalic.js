import { removeITagsAndPreserveText } from "./italic_funcs.js";
// 순환하며 이탤릭체 모두 삭제

export function multiLineRemovingItag ( props ) {
    console.log('여러줄 이탤릭체 제거 실행');
    let { selectedContent, startRangeNode, endRangeNode, selection, range } = props;
    
    selectedContent.childNodes.forEach( tag => {
        removeITagsAndPreserveText( tag );
    });
    console.log('선택부분: ', selectedContent );
    let newStartNode = range.startContainer;
    let newStartOffset = range.startOffset;
    console.log('newStartNode.childNodes.length: ', newStartNode.childNodes.length );
    let selectedLastLineIdx = newStartOffset + ( selectedContent.childNodes.length - 1);

    let lastNodeIdx = newStartNode.children.length - 1;
    let newEndNode = newStartNode.children[lastNodeIdx];
    console.log('newStartNode: ', newStartNode );
    let lastIndex = selectedContent.childNodes.length - 1;
    let newRange = document.createRange();

    Array.from( selectedContent.childNodes ).forEach( ( node, idx ) => {

        if( idx === 0 ) {
            console.log(`R: T`);

            let nodeRangeOffset = node.childNodes.length - 1;

            while( node.firstChild ) {
                newStartNode.childNodes[newStartOffset-1].appendChild( node.firstChild );
            }
            
            let startNodeLen = newStartNode.childNodes[newStartOffset-1].childNodes.length-1;
            
            startRangeNode = newStartNode.childNodes[newStartOffset-1].childNodes[ startNodeLen - nodeRangeOffset ];
            newRange.setStartBefore( startRangeNode );

        } else {

            if( idx !== lastIndex ) {

                console.log(`R: M`);
                newStartNode.insertBefore( node, newStartNode.childNodes[(newStartOffset-1)+(idx-1)].nextSibling );

            } else {
                console.log(`R: B`);
                let clone_ = node.cloneNode(true);
                let node_len = clone_.childNodes.length - 1;
                let lastLine = newStartNode.childNodes[selectedLastLineIdx-1];

                while( node.firstChild ) {
                    lastLine.insertBefore( node.lastChild, lastLine.firstChild );
                }

                endRangeNode = lastLine.childNodes[node_len];
                
            }

        }

    })

    newRange.setEndAfter( endRangeNode );   
    newStartNode.normalize();
    selection.removeAllRanges();
    selection.addRange( newRange );

}