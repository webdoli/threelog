
export const applyH1 = ( selection, range ) => {

    const selectedText = range.extractContents();
    const h1 = document.createElement('h1');
    h1.appendChild( selectedText );
    
    range.insertNode( h1 );

    // 선택 해제
    selection.removeAllRanges();

}




