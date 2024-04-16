import { removeITagsAndPreserveText } from "./italic_funcs.js";
// 순환하며 이탤릭체 모두 삭제

export function multiLineRemovingItag ( props ) {
    console.log('여러줄 이탤릭체 제거 실행');
    let { selectedContent, startRangeNode, endRangeNode, selection, endNode, 
        range, startNode, previousNode } = props;
    
    selectedContent.childNodes.forEach( tag => {
        removeITagsAndPreserveText( tag );
    });
    
    let newStartNode = range.startContainer;
    let newStartOffset = range.startOffset;
    
    let selectedLastLineIdx = newStartOffset + ( selectedContent.childNodes.length - 1);

    let lastNodeIdx = newStartNode.children.length - 1;
    let newEndNode = newStartNode.children[lastNodeIdx];

    // console.log('startNode: ', startNode);
    // console.log('endNode: ', endNode );
    // console.log('startNode.childNodes len: ', startNode.childNodes.length );
    // console.log('previousNode: ', previousNode )
    
    let lastIndex = selectedContent.childNodes.length - 1;
    let newRange = document.createRange();
    let selectedAll = ( !startNode.childNodes.length ) ? true : false;

    let frontNull = (startNode.textContent === "" ) ? true : false;
    let backNull = (endNode.textContent === "" ) ? true : false;

    // console.log('제거 frontNull: ', frontNull );
    // console.log('제거 backNull: ', backNull );
    // console.log('selectAll: ', selectedAll );

    if( selectedAll && backNull && frontNull ) {

        console.log('모두선택됨 backNull frontNull포함');
        let frag = document.createDocumentFragment();
        console.log('previous: ', selectedContent.previousSibling )
        while( selectedContent.firstChild ) {
            frag.appendChild( selectedContent.firstChild );
            
        }
        
        console.log('frag: ', frag );
        // selection.removeAllRanges();
        // selection.addRange( cloneRange );
        
        

    } else {
        
        Array.from( selectedContent.childNodes ).forEach( ( node, idx ) => {
            
            if( idx === 0 ) {
                console.log(`R: T`);
                

                if( frontNull ) {
                    // 상위 범위가 이상함
                    // console.log('node.firstChild: ', node.firstChild );
                    range.insertNode( node );
                    range.setStartBefore( node.firstChild );

                } else {
                    let nodeRangeOffset = node.childNodes.length - 1;
                
                    while( node.firstChild ) {
                        newStartNode.childNodes[newStartOffset-1].appendChild( node.firstChild );
                    }

                    let startNodeLen = newStartNode.childNodes[newStartOffset-1].childNodes.length-1;

                    startRangeNode = newStartNode.childNodes[newStartOffset-1].childNodes[ startNodeLen - nodeRangeOffset ];
                    newRange.setStartBefore( startRangeNode );
                }
                
    
            } else {
    
                if( idx !== lastIndex ) {
    
                    console.log(`R: M`);
                    newStartNode.insertBefore( node, newStartNode.childNodes[(newStartOffset-1)+(idx-1)].nextSibling );
    
                } else {
                    console.log(`R: B`);
                    
                    let clone_ = node.cloneNode(true);
                    let node_len = clone_.childNodes.length - 1;
                    let lastLine = newStartNode.childNodes[selectedLastLineIdx-1];

                    if( backNull ) {

                        let div = document.createElement('div');

                        while( node.firstChild ) {
                            div.appendChild( node.firstChild );
                        }
                        
                        if( lastLine === undefined ) {

                            lastLine = newStartNode.childNodes[selectedLastLineIdx-2];
                            lastLine.parentNode.appendChild( div );
                            let divLastLen = div.childNodes.length - 1;
                            endRangeNode = div.childNodes[ divLastLen ];

                        } else {

                            lastLine.parentNode.insertBefore( div, lastLine );
                            let divLen = div.childNodes.length - 1;
                            endRangeNode = div.childNodes[divLen];

                        }
                        

                    } else {
                        
                        if( frontNull ) {
                            console.log('프론트 없음');
                            // console.log('node: ', node );
                            lastLine = newStartNode.childNodes[selectedLastLineIdx];
                            // console.log('lastLine: ', lastLine );
                            while( node.firstChild ) {
                                endRangeNode = node.lastChild;
                                lastLine.insertBefore( node.lastChild, lastLine.firstChild );
                            }
                            // endRangeNode = lastLine.childNodes[node_len];
                            // console.log('endRangeNode: ', endRangeNode );

                        } else {
                        
                            while( node.firstChild ) {
                                lastLine.insertBefore( node.lastChild, lastLine.firstChild );
                            }
                            endRangeNode = lastLine.childNodes[node_len];
                        
                        }

                    }
                    
                }
    
            }
    
        })
    
        if( frontNull ) {

            range.setEndAfter( endRangeNode );
            // newStartNode.normalize();
            selection.removeAllRanges();
            selection.addRange( range );

        } else {
            newRange.setEndAfter( endRangeNode );   
            newStartNode.normalize();
            selection.removeAllRanges();
            selection.addRange( newRange );
        }
        

    }

}