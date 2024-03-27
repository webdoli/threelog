export function toggleItalic() {
    
    console.log('실행');
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;
  
    const range = selection.getRangeAt(0);

    // const selectedContent = range.extractContents();  //선택된 텍스트 잘라내기 ctrl + x기능

    const selectedText = range.toString();
    const em = document.createElement('em');
    range.surroundContents(span);

    console.log('선택 텍스트: ', selectedText );
    // let containsItalic = false;
    // let containsNonItalic = false;
  
    // // 선택된 내용을 분석하여 이탤릭체가 적용되어 있는지 확인합니다.
    // Array.from( selectedContent.childNodes ).forEach(node => {
    //   if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
    //     containsItalic = true;
    //   } else {
    //     containsNonItalic = true;
    //   }
    // });
  
    // // 변경된 컨텐츠를 준비하기 위한 DocumentFragment를 생성합니다.
    // let newContent = document.createDocumentFragment();
  
    // // 이탤릭체를 적용하거나 제거합니다.
    // if (containsItalic && !containsNonItalic) {
    //   // 모든 선택된 컨텐츠가 이미 이탤릭체로 되어 있으면 이탤릭체를 제거합니다.
    //   Array.from(selectedContent.childNodes).forEach(node => {
    //     if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
    //       while (node.firstChild) {
    //         newContent.appendChild(node.firstChild);
    //       }
    //     }
    //   });
    // } else {
    //   // 일부 또는 전혀 이탤릭체가 적용되지 않은 경우, 전체 선택 내용을 이탤릭체로 변경합니다.
    //   Array.from(selectedContent.childNodes).forEach(node => {
    //     if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
    //       // 이미 이탤릭체인 부분은 그대로 유지합니다.
    //       while (node.firstChild) {
    //         newContent.appendChild(node.firstChild);
    //       }
    //     } else {
    //       // 이탤릭체가 아닌 텍스트나 다른 요소들을 <em> 태그로 감쌉니다.
    //       const em = document.createElement('em');
    //       em.appendChild(node);
    //       newContent.appendChild(em);
    //     }
    //   });
    // }
  
    // // 새로운 컨텐츠를 현재 범위에 삽입합니다.
    // range.deleteContents();
    // range.insertNode(newContent);
  
    // // 변경 후의 선택 범위를 재설정합니다.
    // if (newContent.childNodes.length > 0) {
    //   selection.removeAllRanges();
    //   const newRange = document.createRange();
    //   newRange.setStartBefore(newContent.firstChild);
    //   newRange.setEndAfter(newContent.lastChild);
    //   selection.addRange(newRange);
    // }
  }
  