
export const makeTextBold = () => {

    const selection = window.getSelection();
    if ( !selection.rangeCount ) return; // 선택된 텍스트가 없으면 반환
  
    let range = selection.getRangeAt(0);
    if ( range.collapsed ) return; // 텍스트가 선택되지 않았으면 반환
    
    // 선택된 범위 내의 모든 노드를 순회하면서 <b> 태그를 찾아 처리
    const containsBold = Array.from( range.cloneContents().childNodes )
        .some( node => {
            return node.nodeName === 'B' || node.querySelector && node.querySelector('b');
        });

    if ( containsBold ) {
      // <b> 태그가 포함된 텍스트를 굵게 처리 해제
      document.execCommand('bold', false, null);
    } else {
      // 전체 선택된 텍스트를 굵게 처리
      document.execCommand('bold', false, null);
    }
  
    // 변경된 범위에 따라 새로운 Range 객체를 생성하고 적용
    if (selection.rangeCount > 0) {
        range = selection.getRangeAt(0);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}
