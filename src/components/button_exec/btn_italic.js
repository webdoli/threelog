export function toggleItalic() {

  const selection = window.getSelection();  
  if (!selection.rangeCount) return;

  const upperElementTagName = selection.anchorNode.parentElement.tagName;
  const lowerElementEM =  selection.anchorNode.parentElement.querySelector('em');

  console.log('선택한 부분 상위 태그이름: ', upperElementTagName );
  console.log('선택한 부분 하위 태그: ', lowerElementEM );

  let upperNodeItalicCHK = ( upperElementTagName === 'EM') ? true : false;
  
  // **** 하위 태그에 em 있음 || 상위 태그에 em 없는 경우 ***
  // 상황: 이탤릭체 선택된 상태에서 더 넓게 블락을 선택한 경우
  // 1]새로 선택한 블록 내 텍스트 노드 생성
  // 2]하위 태그의 em태그 삭제
  // 3]range.insertNode()로 em태그 생성
  // 4]텍스트노드.normalize()실행
  if( !upperNodeItalicCHK && lowerElementEM ) {
    console.log('하위 em태그(o), 상위 em태그(x)');
    const range = selection.getRangeAt(0);
    const selectedText = document.createTextNode( selection.toString());
    console.log('선택한 텍스트: ', selectedText );
    range.deleteContents();

    const emNode = document.createElement('em');
    emNode.appendChild( selectedText );

    range.insertNode( emNode );

  }

  
  // 하위 태그에 em 없음 || 상위 태그에 em 없는 경우
  // 상황: 최초로 이탤릭체를 지정하는 경우
  // 1]텍스트 노드 생성
  // 2]em태그 결합
  // 3]선택 위치에 em태그넣기
  if ( !upperNodeItalicCHK && !lowerElementEM ) {
    console.log('하위 em태그(x), 상위 em태그(x)');

    let text = selection.toString();
    const range = selection.getRangeAt(0);
    let lines = text.split('\n');
    let linesLen = lines.length -1;
    console.log('줄바뀜 라인: ', linesLen );
    range.deleteContents();
    let wrapper = document.createElement('span');

    lines.map( (line, idx) => {
      if( idx === 0 ) {
        let startNode = document.createElement('em');
        let textNode = document.createTextNode( line );
        startNode.appendChild( textNode ); 
        wrapper.appendChild( startNode );
      } else if( idx === linesLen ) {
        let midNode = document.createElement('div');
        let midEmNode = document.createElement('em');
        let textNode = document.createTextNode( line );
        midEmNode.appendChild( textNode );
        midNode.appendChild(midEmNode);
        wrapper.appendChild( midNode );
      } else {
        let endNode = document.createElement('em');
        let textNode = document.createTextNode( line );
        endNode.appendChild( textNode );
        wrapper.appendChild( endNode );
      }
    })

    //프로미스 구문
    range.insertNode( wrapper );
    console.log('wrapper: ', wrapper );

    // let convertNode = `<em>${text}</em>`;
    // selection.anchorNode.parentElement.innerHTML = selection.anchorNode.parentElement.innerHTML.replace( text, convertNode );
  }

  // 하위 태그에 em 없음 || 상위 태그에 em 있는 경우
  // 상황: em삭제하고 원래대로 되돌림
  // 1]range노드로 위치 설정
  // 2]텍스트 노드 생성
  // 3]기존 em태그 부분 삭제
  // 4]선택 위치에 텍스트 노드 넣기
  // 5]textNode.normalize()실행
  if( upperNodeItalicCHK && !lowerElementEM ) {

    console.log('하위 em태그(x), 상위 em태그(o)');
    const selectedText = document.createTextNode( selection.toString());
    const range = selection.getRangeAt(0);
    selection.anchorNode.parentElement.remove();

    console.log('selectedText: ', selectedText );
    range.insertNode( selectedText );

    // 선택사항
    selection.removeAllRanges(); // 기존 선택 범위를 제거
    const newRange = document.createRange(); // 새 범위 객체 생성
    newRange.selectNode( selectedText ); // 새로운 텍스트 노드 선택
    selection.addRange(newRange); // 새 범위를 선택 객체에 추가

    selectedText.parentNode.normalize();

  }


  // 하위 태그에 em 있음 || 상위 태그에 em 있는 경우
  // 상황: 있을 수 없음, 적어도 일부러 조작하지 않는 이상 시스템 내에서는 불가능함
  // 1]텍스트만 복사해서 텍스트 노드 생성
  // 2]em태그 모두 삭제
  // 3]insert로 텍스트노드 붙여넣기
  // 4]textNode.normalize()실행

  
  
}
