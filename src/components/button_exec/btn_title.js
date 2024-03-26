
export function creatingTitleTag( selection, range, tagName) {

    // const selection = window.getSelection();
    // if (!selection.rangeCount) return;

    // const range = selection.getRangeAt(0);
    console.log('range: ', range );
    const range01 = selection.getRangeAt(0);
    console.log('range01: ', range01 );
    const selectedText = range.extractContents();

    // '보통 단락'을 위한 예외 처리
    if ( tagName === 'P' && range.commonAncestorContainer.parentNode.nodeName !== 'P') {
      // 선택한 텍스트가 이미 어떤 태그로 감싸져 있는 경우, 그 태그를 제거합니다.
        const parent = range.commonAncestorContainer.parentNode;
            while ( parent.firstChild ) {
                range.insertNode( parent.firstChild );
            }
        range.insertNode( selectedText );

    } else {

      // 선택한 텍스트를 새 태그로 감싸는 기본 처리
        const tag = document.createElement( tagName );
        tag.appendChild( selectedText );
        range.insertNode(tag);

    }

    selection.removeAllRanges();

}

export function wrapTextWithTag( tagName ) {
  console.log('제목 태그: ', tagName );
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const selectedText = selection.toString();

  if ( selectedText ) {
    // 선택된 텍스트로 새 태그 생성
    const newElement = document.createElement( tagName );
    newElement.textContent = selectedText;

    // 선택된 텍스트 삭제 및 새 요소 삽입
    range.deleteContents();
    range.insertNode( newElement );

    // 삽입된 새 요소를 포함하는 새로운 Range 객체 생성
    const newRange = document.createRange();
    newRange.selectNode( newElement );

    // 기존 선택 제거 후 새 선택 추가
    selection.removeAllRanges();
    selection.addRange( newRange );

  }
}