/**!
 * @license Scriptor.js - A library for building your own custom text editors
 * LICENSED UNDER MIT LICENSE
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/Scriptor.js/
 */
import { makeTextBold } from "./components/button_exec/btn_bold.js"; // 글씨체 굵게 만드는 버튼 모듈
import { toggleItalic } from "./components/button_exec/btn_italic.js";
import { makeImgs } from "./components/button_exec/btn_img.js"; // 이미지 업로드 버튼 모듈
import { wrapTextNodesInPTags, convert_to_P_Tag, encodeHtml } from "./components/hook.js";
import { wrapTextWithTag } from "./components/button_exec/btn_title.js";

window.addEventListener('DOMContentLoaded', e => {
  
  const form = document.getElementById('text-editor');

  const defaultButtonProps = {
    insert: false,
    htmltags: true,
    value: '',
    wrap: false
  };
  
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

    form.addEventListener('input', function(e) {

      const contentEditableDiv = e.target;
      updateHtmlOutput();
    
    });

    document.getElementById('transBtn').addEventListener('click', function() {
      let textEditor = document.getElementById('text-editor');
      let post = document.getElementById('post');
      
      // text-editor에서 HTML 내용을 추출하고 인코딩합니다.
      let encodedHtml = encodeHtml(textEditor.innerHTML);
      
      // 인코딩된 HTML을 html-output 내부의 <pre> 요소에 설정합니다.
      post.innerHTML = '<pre>' + encodedHtml + '</pre>';
    });
  
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
      if ( buttonValue === 'b' && htmlTags === 'True' ) { 
        
        makeTextBold();
        updateHtmlOutput();
      }

      if (buttonValue === 'i' && htmlTags === 'True') {
        
        toggleItalic(); // '이탤릭체' 버튼 클릭 시 함수 호출
        updateHtmlOutput();
      }

      // 버튼의 데이터를 확인하여 '이미지' 업로드 실행
      if ( buttonValue === 'img' && htmlTags === 'True' ) {
          let imgEl = document.getElementById('insertImage');
          let fileEl = document.getElementById('imageUpload');
          makeImgs( imgEl, fileEl );
      }
      
      if( buttonValue === 'P' ) {
        console.log('보통 단락'); 
        wrapTextWithTag( buttonValue );
      }
      
      if( buttonValue === 'H1' || buttonValue === 'H2' ||  buttonValue === 'H3' ) { 
        console.log('제목 버튼');
        wrapTextWithTag( buttonValue ); 
        updateHtmlOutput(); 
      }
      
    }

    // 글씨체
    document.querySelectorAll('.font-option').forEach( function(item) {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const font = this.getAttribute('data-font');
        applyFontToSelection(font);
      });
    });

    // 선택한 텍스트에 글씨체 적용
    function applyFontToSelection(fontName) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
    
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontFamily = fontName;
      span.appendChild(range.extractContents());
      range.insertNode(span);
      updateHtmlOutput();
    }

    // 글씨크기
    document.getElementById('fontSizeInput').addEventListener('change', function() {
      const fontSize = this.value;
      applyFontSizeToSelection(fontSize);
    });

    // 선택한 텍스트에 글씨 크기 적용
    function applyFontSizeToSelection(fontSize) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
    
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = fontSize + 'px';
      span.appendChild(range.extractContents());
      range.insertNode(span);
      updateHtmlOutput();
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

}
)