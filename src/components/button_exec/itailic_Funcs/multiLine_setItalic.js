import { removeITagsAndPreserveText, transInnerNode, removeEmptyNodes } from "./italic_funcs.js";

//:: <i>태그가 없는 여러줄에서 i태그 씌우기 
export function multiLineCreatingItag ( props ) {
    console.log('여러줄 이탤릭체 생성');
    let { 
            range, selection, selectedContent, startNode, startNodeParent, startOffset,
            endNode, startRangeNode, endRangeNode
        } = props;
    
    let newStartNode = range.startContainer;
    let newStartOffset = range.startOffset;
    
    let selectedLastLineIdx = newStartOffset + ( selectedContent.childNodes.length - 1);
    let textEditorNode = newStartNode.parentNode;
    let lastIndex = selectedContent.childNodes.length - 1;
    let newRange = document.createRange();
    console.log('startNode len: ', startNode.childNodes.length );
    console.log('newStartNode len: ', newStartNode.childNodes.length );
    console.log('startNode: ', startNode );
    let selectedAll = ( !newStartNode.childNodes.length ) ? true : false;

    if( selectedAll ) {
        
        let frag = document.createDocumentFragment();
        console.log('시작전 selectedContent: ', selectedContent);

        const childNodes = Array.from( selectedContent.childNodes );
        
        childNodes.forEach( node => {

            if ( node.nodeType === Node.ELEMENT_NODE && node.tagName === 'DIV' ) {
                // node가 div인 경우에만 처리
                const italicElement = document.createElement('i');

                // div 내부의 모든 자식 노드를 <i> 요소로 이동
                while ( node.firstChild ) {
                    italicElement.appendChild( node.firstChild );
                }

                // 원래의 div 내부를 비우고 <i> 요소를 추가
                node.appendChild(italicElement);
            }
        });

        range.insertNode( selectedContent );
        
    }
    else {

        Array.from( selectedContent.childNodes ).forEach(( node, idx ) => {

            if( idx === 0 ) { //추출한 첫 번째 노드
                console.log(`S: T`);

                let iTag = transInnerNode( node );
                if ( selectedAll ) {
                    let wrapper = document.createElement('div');
                    wrapper.appendChild( iTag );
                    // console.log('newStartNode: ', newStartNode.parentNode.childNodes[1] );
                    newStartNode.parentNode.childNodes[1].appendChild( iTag );
                    console.log('iTag: ', iTag );
                    console.log('iTag parentNode: ', iTag.parentNode );
                    startRangeNode = iTag.parentNode;
                    // newStartNode.parentNode.firstChild.appendChild( wrapper );

                    // newStartNode.insertBefore( iTag, newStartNode.firstChild );
                } else {
                    newStartNode.childNodes[newStartOffset-1].appendChild( iTag );
                    startRangeNode = iTag
                }

                newRange.setStartBefore( startRangeNode );

            } else {

                if( idx !== lastIndex ) {
                    console.log(`S: M`)

                    let wrapper = document.createElement('div');
                    let convertItag = transInnerNode( node );

                    wrapper.appendChild( convertItag );

                    ( selectedAll ) 
                        ? newStartNode.parentNode.appendChild( wrapper )
                        : newStartNode.insertBefore( wrapper, newStartNode.childNodes[(newStartOffset-1)+(idx-1)].nextSibling );


                } else { // 마지막 노드 병합 로직

                    console.log(`S: B`)
                    removeITagsAndPreserveText( node );

                    if ( node.nodeType === Node.ELEMENT_NODE && ( node.nodeName === 'DIV' || node.nodeName === 'P')) {

                        let transItagNode = transInnerNode( node );
                        if( selectedAll ) {
                            let wrapper = document.createElement('div');
                            wrapper.appendChild( transItagNode );
                            newStartNode.parentNode.appendChild( wrapper );
                            endRangeNode = transItagNode;

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
    }

}