import { chkMultiLineItalicRemoved } from "./italic_funcs.js";
import { multiLineCreatingItag } from "./multiLine_setItalic.js";
import { multiLineRemovingItag } from "./multiLine_removeItalic.js";

export default function multiLine ( props ) {
    
    let { 
        range, 
        selectedContent, 
        selection, 
        startNode, 
        startNodeParent,
        startOffset,
        cloneContents,
        previousNode,
        endNode, 
        endOffset 
    } = props;
    let startRangeNode;
    let endRangeNode;
    console.log('selectedContent: ', selectedContent );
    console.log('cloneContents: ', cloneContents );
    let chkMulti_ItalicRemove = chkMultiLineItalicRemoved( cloneContents );
        // 마지막 부분 이텔릭인지 확인
        if( chkMulti_ItalicRemove ) {
            // 순환하며 이탤릭체 제거
            multiLineRemovingItag({
                range,
                selectedContent,
                startNode,
                startOffset,
                startNodeParent,
                previousNode,
                endNode,
                endOffset,
                startRangeNode,
                endRangeNode,
                selection
            })

        } else {
            // 순환하며 이탤릭체 씌우기
            multiLineCreatingItag( {
                previousNode,
                selectedContent,
                startNode,
                startNodeParent,
                startOffset,
                endNode,
                endOffset,
                range, 
                selection, 
                startRangeNode, 
                endRangeNode
            });   
        }
    
}