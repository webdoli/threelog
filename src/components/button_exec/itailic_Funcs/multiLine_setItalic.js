import { removeITagsAndPreserveText, transInnerNode, removeEmptyNodes } from "./italic_funcs.js";

//:: <i>태그가 없는 여러줄에서 i태그 씌우기 
export function multiLineCreatingItag ( props ) {
    console.log('여러줄 이탤릭체 생성');
    let { 
            range, selection, selectedContent, startNode, startNodeParent, startOffset,
            endNode, endNodeParent, startRangeNode, endRangeNode
        } = props;
    console.log('2]startNode: ', startNode );
    let newStartNode = range.startContainer;
    let newStartOffset = range.startOffset;
    
    let selectedLastLineIdx = newStartOffset + ( selectedContent.childNodes.length - 1);
    let textEditorNode = newStartNode.parentNode;
    let lastIndex = selectedContent.childNodes.length - 1;
    let newRange = document.createRange();
    let selectedAll = ( !startNode.childNodes.length ) ? true : false;
    

    // if( newStartNode.childNodes.length === 0 ) {

    //     // 전체글씨 모두 선택
    //     let wrapper = document.createDocumentFragment();
        
    //     Array.from( selectedContent.childNodes ).filter( node => {
            
    //         while( node.firstChild ) {
    //             let i = document.createElement('i');
    //             let div = document.createElement('div');
    //             i.appendChild( node.firstChild );
    //             div.appendChild( i );
    //             wrapper.appendChild( div );
    //         }
            
    //     });
        
    //     textEditorNode.replaceChild( wrapper, textEditorNode.children[0] );
    //     newRange.setStartBefore( textEditorNode.children[0] );
    //     newRange.setEndAfter( textEditorNode.children[textEditorNode.children.length-1] );
    //     selection.removeAllRanges();
    //     selection.addRange( newRange );
        
    // } else {
        
        Array.from( selectedContent.childNodes ).forEach(( node, idx ) => {
            
            if( idx === 0 ) { //추출한 첫 번째 노드
                console.log(`S: T`);
                
                let iTag = transInnerNode( node );
                ( selectedAll ) 
                    ? newStartNode.appendChild( iTag )
                    : newStartNode.childNodes[newStartOffset-1].appendChild( iTag );
                
                    startRangeNode = iTag
                newRange.setStartBefore( startRangeNode );
                
            } else {
                
                if( idx !== lastIndex ) {
                    console.log(`S: M`)
                    
                    let wrapper = document.createElement('div');
                    let convertItag = transInnerNode( node );
    
                    wrapper.appendChild( convertItag );
                    console.log('newStartNode: ', newStartNode );
                    ( selectedAll ) 
                        ? newStartNode.parentNode.appendChild( wrapper )
                        : newStartNode.insertBefore( wrapper, newStartNode.childNodes[(newStartOffset-1)+(idx-1)].nextSibling );
                    
    
                } else { // 마지막 노드 병합 로직
                    
                    console.log(`S: B`)
                    removeITagsAndPreserveText( node );
                    
                    if ( node.nodeType === Node.ELEMENT_NODE && ( node.nodeName === 'DIV' || node.nodeName === 'P')) {
                        
                        let transItagNode = transInnerNode( node );
                        if( selectedAll ) {

                            console.log('newStartNode: ', newStartNode );
                            newStartNode.parentNode.appendChild( transItagNode );

                        } else {
                            let lastLine = newStartNode.childNodes[selectedLastLineIdx-1];
                            let nextElement = lastLine;
                            
                            if( nextElement.firstChild ) nextElement.insertBefore( transItagNode, nextElement.firstChild );
                            endRangeNode = nextElement.children[0];
                        }

                    }
    
                }
                
            }
    
        });
    
        newRange.setEndAfter( endRangeNode );
        selection.removeAllRanges();
        selection.addRange( newRange );

    // }

}