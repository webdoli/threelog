export function toggleItalic() {

  const selection = window.getSelection();  
  if (!selection.rangeCount) return;


  const range = selection.getRangeAt(0);
  const selectedContent = range.extractContents();
  const startNode = range.startContainer;
  const startOffset = range.startOffset;  //첫째행, 첫째줄을 의미
  const endNode = range.endContainer;
  const endOffset = range.endOffset;
  const lastIndex = selectedContent.childNodes.length - 1;

  // console.log('startNode: ', startNode );
  // console.log('startOffset: ', startOffset);
  
  // console.log('endNode: ', endNode );
  // console.log('endOffset: ', endOffset );
  // selectedContent의 첫 번째 항목을 앞의 노드와 병합
  if (selectedContent.childNodes.length > 0) {
    const firstNode = selectedContent.childNodes[0];
    if (firstNode.nodeType === Node.ELEMENT_NODE && (firstNode.nodeName === 'DIV' || firstNode.nodeName === 'P')) {
      
      // 첫 번째 노드 병합 로직 (예: 이탤릭 처리 등)
      console.log('첫번째 노드 로직: ', firstNode );
      Array.from( firstNode.childNodes ).forEach( node => {
        let emEl = document.createElement('em');
        let previousElement = startNode.childNodes[startOffset].previousSibling;
        emEl.appendChild( node.cloneNode(true) );
        previousElement.appendChild( emEl );
        
      })
      
    }

    // range.startContainer 앞에 첫 번째 노드 삽입
    // range.insertNode(firstNode);
  }

  // 나머지 노드들을 독립적으로 존재하도록 문서에 삽입
  Array.from(selectedContent.childNodes).forEach(node => {
    // console.log('node: ', node );
    // console.log('startNode: ', startNode );
    // console.log('selectedContent: ', selectedContent );
    // console.log('startOffset: ', startOffset);
    startNode.insertBefore( node, startNode.childNodes[startOffset]);
    
    // selectedContent.after( node )
    
  });

  // 마지막 항목을 뒤의 노드와 병합
  if (selectedContent.childNodes.length > 0) {
    const lastNode = selectedContent.childNodes[selectedContent.childNodes.length - 1];
    if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
      // 마지막 노드 병합 로직
      console.log('마지막 노드: ', lastNode );

      // 여기서는 단순화를 위해 병합 로직을 구현하지 않음
    }

    // 뒤에 노드 삽입 위치를 찾기 위한 로직이 필요
    // 이 예제에서는 insertNode를 사용하여 간단히 구현
    range.collapse(false); // 범위를 끝점으로 이동
    // range.insertNode(lastNode);
  }

  

  // 선택 영역 재설정
  selection.removeAllRanges();



  // const range = selection.getRangeAt(0);
  // const startNode = range.startContainer;
  // const startOffset = range.startOffset;
  // const selectedContent = range.extractContents();
  // const fragment = document.createDocumentFragment();
  // const lastIndex = selectedContent.childNodes.length - 1;

  // // 선택된 컨텐츠를 순회하며 처리
  // Array.from(selectedContent.childNodes).forEach( ( node, idx) => {
  //     // 블록 레벨 요소 내의 텍스트 노드를 찾아 이탤릭 처리
  //     // let newNode = node.cloneNode(true); 

  //     if ( idx === lastIndex || idx === 0 && node.nodeType === Node.ELEMENT_NODE && (node.nodeName === 'DIV' || node.nodeName === 'P')) {

  //         Array.from(node.childNodes).forEach( child => {

  //           console.log('첫 or 끝')

  //           let emEl = document.createElement('em');
  //           emEl.appendChild( child.cloneNode(true) );
  //           fragment.appendChild( emEl );

  //         });
            
  //       } else {

  //         console.log('중간 부분')
  //         let newNode = node.cloneNode(true); 
  //         fragment.appendChild(newNode);
          
  //     }

  // });

  // console.log('fragment: ', fragment );
  // // 처리된 내용을 원래의 시작 위치에 삽입
  // if (startNode.nodeType === Node.TEXT_NODE) {
  //   // 시작 노드가 텍스트 노드인 경우, 텍스트 노드를 분할하고 그 사이에 삽입
  //   const textNode = startNode.splitText(startOffset);
  //   textNode.parentNode.insertBefore(fragment, textNode);
  // } else if (startNode.nodeType === Node.ELEMENT_NODE) {
  //   // 시작 노드가 엘리먼트 노드인 경우, 오프셋에 해당하는 위치에 삽입
  //   startNode.insertBefore(fragment, startNode.childNodes[startOffset]);
  // }


  // // 선택 영역 재설정
  // selection.removeAllRanges();

}
