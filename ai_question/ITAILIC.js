export function toggleItalic() {
    const selection = window.getSelection();
    if (!selection.rangeCount || selection.isCollapsed) return;
  
    const range = selection.getRangeAt(0);
    let selectedContent = range.extractContents();
    
    // 선택된 컨텐츠 내에서 <em> 태그를 찾습니다.
    const emElements = selectedContent.querySelectorAll('em');
    let isFullyItalic = emElements.length && Array.from(selectedContent.childNodes).every(node => node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM');
    
    // 선택된 컨텐츠를 다시 삽입하기 전에 DocumentFragment를 초기화합니다.
    let newContent = document.createDocumentFragment();
  
    if (isFullyItalic) {
      // 모두 이탤릭체인 경우, 이탤릭체를 제거합니다.
      Array.from(emElements).forEach(em => {
        Array.from(em.childNodes).forEach(child => newContent.appendChild(child.cloneNode(true)));
      });
    } else {
      // 부분적으로 이탤릭체가 적용되었거나 전혀 적용되지 않은 경우
      // <em>이 있으면 그 내용만 사용하고, 나머지 텍스트는 새로운 <em>에 적용합니다.
      Array.from(selectedContent.childNodes).forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'EM') {
          Array.from(node.childNodes).forEach(child => newContent.appendChild(child.cloneNode(true)));
        } else {
          let em = document.createElement('em');
          em.appendChild(node.cloneNode(true));
          newContent.appendChild(em);
        }
      });
    }
  
    // 변경된 내용을 현재 커서 위치에 삽입합니다.
    range.deleteContents();
    range.insertNode(newContent);
  
    // if (insertedNodes.length > 0) {
    //     // 변경 후 선택 범위를 재설정합니다.
    //     selection.removeAllRanges();
    //     const newRange = document.createRange();
    //     newRange.setStartBefore(insertedNodes[0]);
    //     newRange.setEndAfter(insertedNodes[insertedNodes.length - 1]);
    //     selection.addRange(newRange);
    //   } else {
    //     console.error('Failed to re-select the range. The content might not have been inserted correctly.');
    //   }
  }
  