import singleLine from "./itailic_Funcs/singleLine.js";
import multiLine from "./itailic_Funcs/multiLine.js";

export function toggleItalic () {
    
    let savedRange;
    let selection = window.getSelection();
    if (!selection.rangeCount) return;  
    let range = selection.getRangeAt(0);
    savedRange = range.cloneRange();
    let selectedText = selection.toString();

    //여러줄 선택 or 한줄 선택
    let multiSLC = ( selectedText.split('\n').length > 1 ) ? true : false; 

    // 싱글라인
    ( !multiSLC ) ? singleLine( range, selection, savedRange ) : multiLine( range, selection, savedRange );

}