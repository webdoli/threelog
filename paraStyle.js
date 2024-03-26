/**!
 * @license Scriptor.js - A library for building your own custom text editors
 * LICENSED UNDER MIT LICENSE
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/Scriptor.js/
 */
import { makeTextBold } from "./components/button_exec/btn_bold.js"; // 글씨체 굵게 만드는 버튼 모듈
import { makeImgs } from "./components/button_exec/btn_img.js"; // 이미지 업로드 버튼 모듈

window.addEventListener('DOMContentLoaded', e => {

  const defaultButtonProps = {
    insert: false,
    htmltags: true,
    value: '',
    wrap: false
  };
  
  const form = document.getElementById('text-editor');
  
  if ( form != null ){

    let DEBUG = false; 
    let startPosition = 0;
    let currentTextPosition = 0;
  
    form.addEventListener('mouseup', (e) => {
  
      setTimeout(() => {
        let selectedTextLength = window.getSelection().toString().length;
        let anchorPos = window.getSelection().anchorOffset;

        ( selectedTextLength > 0 ) 
          ? currentTextPosition = window.getSelection().anchorOffset + selectedTextLength
          : currentTextPosition = window.getSelection().anchorOffset;
        // console.log('현재 마우스 포지션: ', currentTextPosition );

      }, 0 )
  
    });

    
// input 이벤트 리스너에서 사용자 입력을 p 태그로 변환하는 로직
form.addEventListener('input', (e) => {

  let htmlOutput = document.getElementById('html-output');
  let content = e.target.innerHTML;
  
  // 기존 div 태그 제거
  content = content.replace(/<div>/gi, '<p>').replace(/<\/div>/gi, '</p>');
  content = content.replace(/ /g, '&nbsp;');

  // 브라우저가 자동으로 추가하는 br 태그 제거 (엔터를 칠 때마다)
  content = content.replace(/<br>/gi, '');

  // div가 아닌 다른 태그들 내부에 있는 텍스트를 p 태그로 감싸기
  content = wrapTextNodesInPTags( content );
  htmlOutput.innerHTML = content;

  // html-output에도 변경 사항 적용
  updateHtmlOutput();

});



// 텍스트 노드를 p 태그로 감싸는 함수
function wrapTextNodesInPTags( content ) {

  let div = document.createElement('div');
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
  return div.innerHTML;
}

// 'Code' 버튼을 클릭했을 때 처리하는 로직
document.getElementById('transBtn').addEventListener('click', convertHtml);

function convertHtml() {

  let htmlOutput = document.getElementById('html-output');
  let postingOutput = document.getElementById('postingOutput');
  let posting = document.getElementById('post');

  // htmlOutput에서 p 태그만 추출하여 console에 로깅
  let pTags = htmlOutput.querySelectorAll('p');

  pTags.forEach(p => {

    //포스팅 글 게시
    postingOutput.appendChild(p);

    //코드 변환
    let tmpBR = document.createElement('br');
    let tmp = document.createTextNode( p.outerHTML );
    posting.appendChild( tmp );
    posting.appendChild( tmpBR );
    
  });

}
  
    /// Get all Text Editor Button Values
    const buttons = document.querySelectorAll('[data-threelog-btn]');
    
    buttons.forEach((button) => button.addEventListener('click', (e) => {
      e.preventDefault();
      handleClick( button, form )
    }));

    function handleClick( button ) {

      // 버튼 value값 받기
      const buttonValue = button.getAttribute('value');
      const htmlTags = button.getAttribute('htmltags');

      // 버튼의 데이터를 확인하여 'Bold' 기능 실행
      ( buttonValue === 'b' && htmlTags === 'True' ) ? makeTextBold() : null;

      // 버튼의 데이터를 확인하여 '이미지' 업로드 실행
      if ( buttonValue === 'img' && htmlTags === 'True' ) {
          let imgEl = document.getElementById('insertImage');
          let fileEl = document.getElementById('imageUpload');
          makeImgs( imgEl, fileEl );
      }
      
      if( buttonValue === 'P' ) wrapTextWithTag( buttonValue );
      if( buttonValue === 'H1' ) wrapTextWithTag( buttonValue );
      if( buttonValue === 'H2' ) wrapTextWithTag( buttonValue );
      if( buttonValue === 'H3' ) wrapTextWithTag( buttonValue );
      
    }

    function wrapTextWithTag(tagName) {
      
      const textEditor = document.getElementById('text-editor');
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

        // html-output에도 변경 사항 적용
        updateHtmlOutput();

      }
    }

    // html-output에 변경 사항을 적용하는 함수
    function updateHtmlOutput() {

      const textEditor = document.getElementById('text-editor');
      const htmlOutput = document.getElementById('html-output');
      const content = textEditor.innerHTML;

      // html-output의 내용을 text-editor의 현재 상태로 업데이트
      htmlOutput.innerHTML = content;

    }

  }

})