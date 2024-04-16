import singleLine from "./itailic_Funcs/singleLine.js";
import multiLine from "./itailic_Funcs/multiLine.js";
import { checkParentNodeDiv, removeEmptyTags } from "./itailic_Funcs/italic_funcs.js";

export function toggleItalic () {
    
    let savedRange;
    let selection = window.getSelection();
    if (!selection.rangeCount) return;  
    let range = selection.getRangeAt(0);
    
    let startNode = range.startContainer;
    let previousNode = startNode.previousSibling;
    if (!previousNode) {
        // 형제 노드가 없다면 부모의 이전 형제를 확인합니다.
        previousNode = startNode.parentNode.previousSibling;
    }
    let startNodeParent = range.startContainer.parentNode;
    let startOffset = range.startOffset;
    let cloneContents = range.cloneContents();
    // console.log('range.cloneNode(true): ', range.cloneContents());
    // console.log('startNode: ', startNode );
    // console.log('startOffset: ', startOffset );
    // console.log('previousNode: ', previousNode );
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
    // console.log('commonAncestor: ', commonAncestor)
    removeEmptyTags(commonAncestor);
    // console.log('조상노드: ', commonAncestor );

    //여러줄 선택 or 한줄 선택
    console.log('selectedText: ', selectedText );
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
            cloneContents,
            savedRange,
            startNode,
            startNodeParent,
            endNode,
            previousNode,
            startOffset,
            endOffset,
            selectedText, 
            selectedContent 
        });

}