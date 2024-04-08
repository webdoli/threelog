import { removeEmptyTags, chkMultiLineItalicRemoved } from "./italic_funcs.js";
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
        endNode, 
        endNodeParent,
        endOffset 
    } = props;
    let startRangeNode;
    let endRangeNode;

    let chkMulti_ItalicRemove = chkMultiLineItalicRemoved( selectedContent );
        console.log('이탤릭체 부분: ', chkMulti_ItalicRemove ); 
        // 마지막 부분 이텔릭인지 확인
        if( chkMulti_ItalicRemove ) {
            // 순환하며 이탤릭체 제거
            multiLineRemovingItag({
                range,
                selectedContent,
                startNode,
                startOffset,
                endNode,
                endOffset,
                startRangeNode,
                endRangeNode,
                selection
            })

        } else {
            // 순환하며 이탤릭체 씌우기
            multiLineCreatingItag( {
                selectedContent,
                startNode,
                startNodeParent,
                startOffset,
                endNode,
                endNodeParent,
                endOffset,
                range, 
                selection, 
                startRangeNode, 
                endRangeNode
            });   
        }

    removeEmptyTags( selectedContent );
    
}