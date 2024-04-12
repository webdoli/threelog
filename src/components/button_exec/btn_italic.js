import singleLine from "./itailic_Funcs/singleLine.js";
import multiLine from "./itailic_Funcs/multiLine.js";
import { checkParentNodeDiv, removeEmptyTags } from "./itailic_Funcs/italic_funcs.js";

export function toggleItalic () {
    
    let savedRange;
    let selection = window.getSelection();
    if (!selection.rangeCount) return;  
    let range = selection.getRangeAt(0);
    let startNode = range.startContainer;
    let startNodeParent = range.startContainer.parentNode;
    let startOffset = range.startOffset;
    
    let endNode = range.endContainer;
    let endOffset = range.endOffset;
    
    savedRange = range.cloneRange();
    let selectedText = selection.toString();
    let selectedContent = range.extractContents();
    
    // 추출된 내용 앞뒤의 최상위 부모 노드를 찾음
    let commonAncestor = range.commonAncestorContainer;
    if (commonAncestor.nodeType !== Node.ELEMENT_NODE) {
        commonAncestor = commonAncestor.parentNode;
    }

    removeEmptyTags(commonAncestor);
    // console.log('조상노드: ', commonAncestor );

    //여러줄 선택 or 한줄 선택
    let multiSLC = ( selectedText.split('\n').length > 1 ) ? true : false; 

    // 싱글라인
    ( !multiSLC ) 
        ? singleLine({
            range, 
            selection,
            selectedContent, 
            savedRange 
        }) 
        : multiLine({ 
            selection, 
            range, 
            savedRange,
            startNode,
            startNodeParent,
            endNode,
            startOffset,
            endOffset,
            selectedText, 
            selectedContent 
        });

}