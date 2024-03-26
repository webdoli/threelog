/// 텍스트 에디터에서 사용자가 블록으로 선택한 글씨만 반환
export function getSelectionText() {

    if ( window.getSelection) return window.getSelection().toString();
    if ( document.selection && document.selection.type != 'Control' ) return document.selection.createRange().text;
    return '';

}

export function checkBool(x) {

    return AttributeToLowerCase( x ) === 'true' || x === true;

}

// 텍스트 노드를 p 태그로 감싸기, div가 아닌 다른 태그들 내부에 있는 텍스트를 p 태그로 감싸기
export function wrapTextNodesInPTags( content, copyEl ) {

    let div = document.createElement('div');
  
    // 기존 div 태그 제거
    content = content.replace(/<div>/gi, '<p>').replace(/<\/div>/gi, '</p>');
    content = content.replace(/ /g, '&nbsp;');
  
    // 브라우저가 자동으로 추가하는 br 태그 제거 (엔터를 칠 때마다)
    content = content.replace(/<br>/gi, '');
    
    div.innerHTML = content;
  
    let childNodes = div.childNodes;
  
    childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '') {
        // 텍스트 노드일 경우, p 태그로 감쌉니다.
        let p = document.createElement('p');
        p.appendChild(node.cloneNode(true));
        div.replaceChild(p, node);
      }
    });
  
    // 갱신된 div의 innerHTML을 결과로 반환
    copyEl.innerHTML = div.innerHTML;
}

// scriptor.js에서 'Code' 버튼을 클릭했을 때 p태그를 처리하는 로직
    // document.getElementById('transBtn')
    //   .addEventListener('click', convert_to_P_Tag( 
    //     document.getElementById('html-output'),
    //     document.getElementById('post')
    //   ));
export function convert_to_P_Tag( convertedElement, convertingElement) {

    // convertedElement: getElementById('id')로 가져온 엘리먼트, value, innerHTML 이런거 필요없음
    // convertingElement: getElementById('id')로 내보낼 엘리먼트, value, innerHTML이런거 필요없음

    // htmlOutput에서 p 태그만 추출하여 console에 로깅
    let pTags = convertedElement.querySelectorAll('p');

    pTags.forEach(p => {

      //코드 변환
      let tmpBR = document.createElement('br');
      let tmp = document.createTextNode( p.outerHTML );
      convertingElement.appendChild( tmp );
      convertingElement.appendChild( tmpBR );

    });

}

export function encodeHtml( html ) {
    // HTML 특수 문자들을 HTML 엔티티로 교체합니다.
    return html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

}



/*******************/
/*===  내장함수  ===*/
/*******************/
function AttributeToLowerCase( text ) {

    text = text.toString()
    const x = text.toLowerCase()
    return x

}