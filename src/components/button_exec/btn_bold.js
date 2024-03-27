
export const makeTextBold = () => {

    const selection = window.getSelection();
    if ( !selection.rangeCount ) return; // 선택된 텍스트가 없으면 반환
  
    const range = selection.getRangeAt(0);
    const selectedText = range.extractContents();

    // 현재 선택된 텍스트가 <strong> 태그로 이미 감싸져 있는지 확인
    if ( selectedText.querySelector('strong') ) {
      // <strong> 태그 내부의 텍스트를 추출하여 원래 위치에 삽입
      range.insertNode( document.createTextNode(selectedText.querySelector('strong').textContent));
    
    } else {
      // 선택된 텍스트를 <strong> 태그로 감싸기
      const strong = document.createElement('strong');
      strong.appendChild(selectedText);
      range.insertNode(strong);
    }

    // 새로운 선택 범위 생성
    const newRange = document.createRange();

    // 캐럿을 <strong> 태그 뒤에 위치시키기
    newRange.setStartAfter(range.endContainer);
    newRange.setEndAfter(range.endContainer);

    // 변경된 범위로 선택 영역 업데이트
    selection.removeAllRanges();
    selection.addRange(newRange);

}
