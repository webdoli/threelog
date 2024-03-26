/// 텍스트 에디터에서 사용자가 블록으로 선택한 글씨만 반환
export function getSelectionText() {

    if ( window.getSelection) return window.getSelection().toString();
    if ( document.selection && document.selection.type != 'Control' ) return document.selection.createRange().text;
    return '';

}

export function checkBool(x) {

    return AttributeToLowerCase( x ) === 'true' || x === true;

}



/*******************/
/*===  내장함수  ===*/
/*******************/
function AttributeToLowerCase( text ) {

    text = text.toString()
    const x = text.toLowerCase()
    return x

}