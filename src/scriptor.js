/**!
 * @license Scriptor.js - A library for building your own custom text editors
 * LICENSED UNDER MIT LICENSE
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/Scriptor.js/
 */
import { makeTextBold } from "./components/button_exec/btn_bold.js";
import { makeImgs } from "./components/button_exec/btn_img.js";

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
  
    })
  
    form.addEventListener('input', () => {
      
      const selection = window.getSelection();
      if (!selection.rangeCount) return; // 선택된 텍스트가 없으면 반환
      const range = selection.getRangeAt(0);
      const endPosition = range.endOffset;
    
    });
  
    /// Load any default text area content
    window.addEventListener('load', function (e) {
      // This prevents the window from reloading
      let input = form.textContent;
    });
  
    /// Get all Text Editor Button Values
    const buttons = document.querySelectorAll('[data-threelog-btn]');
    buttons.forEach((button) => button.addEventListener('click', (e) => {
      e.preventDefault();
      handleClick( button, form )
    }));

    function handleClick( button, form ) {

      // 버튼 value값 받기
      const buttonValue = button.getAttribute('value');
      const htmlTags = button.getAttribute('htmltags');

      // 버튼의 데이터를 확인하여 'Bold' 기능 실행
      ( buttonValue === 'b' && htmlTags === 'True' ) ? makeTextBold() : null;
      if ( buttonValue === 'img' && htmlTags === 'True' ) {
          let imgEl = document.getElementById('insertImage');
          let fileEl = document.getElementById('imageUpload');
          makeImgs( imgEl, fileEl );
      }

      form.value = getNewValue( button, form.textContent );
      
    }
  
    function getNewValue( button, text ) {
        // allows custom functions to be called on button clicks.
      
      if ( button.getAttribute("custom-function") ) eval( button.getAttribute("custom-function") )

      // for each value - check if type is true or false. 
      const [insert, htmltags, wrap] = 
        ['insert', 'htmltags', 'wrap'].map((key) => checkBool( button.getAttribute(key) ?? defaultButtonProps[key] )); 
      
      const value = button.getAttribute('value') ?? defaultButtonProps['value'];
      // DEBUG && console.table({ insert, value, htmltags, wrap });
    
      // Insert Value
      if (insert) return text.substring(0, currentTextPosition) + value + text.substring(currentTextPosition, text.length);
    
      /// Highlighted Text Options
      if (getSelectionText() === '') {
        // no text was hightlighted - just add the values
        // todo - set carot in between the value added
        if (htmltags) return text.substring(0, currentTextPosition) + wrapText('', value, true) + text.substring(currentTextPosition, text.length);
        if (!wrap) return text + value;
        return (form.value = text + value + value);
      }
    
      if ( getSelectionText() != '' ) {
       
        if (wrap) {

          if ( htmltags ) return text.replace( getSelectionText(), wrapText( getSelectionText(), value ));
          // Not wrapping with html tags <>
          return text.replace(getSelectionText(), wrapText(getSelectionText(), value, false));

        } else {
          // HTML태그를 변환합니다.
          if ( getSelectionText().startsWith(value)) return text.replace(value, '');
        
          // Add to the start of the value::에러 발생
          return form.textContent.replace( getSelectionText(), value + getSelectionText());

        }
      }
    }
  
    /// 텍스트 에디터에서 선택한 글씨를 반환합니다.
    function getSelectionText() {

      if (window.getSelection) return window.getSelection().toString();
      if (document.selection && document.selection.type != 'Control') return document.selection.createRange().text;
      return '';

    }
  
  
    // Wrap Highlighted Text On Button Click
    function wrapText( text, wrap, html_tags = true) {
      const string = text.trim();
      DEBUG && console.log(wrap);
      // if Highlighted Text String Already Contains A Wrap At Start & End - Remove It
      if (string.startsWith(`<${wrap}>`)) {
        DEBUG && console.log(wrap);
        return string.replace(RegExp(`^<${wrap}>`), '').replace(RegExp(`</${wrap}>$`), '');
      }
      if (string.startsWith(`${wrap}`) == true) {
        DEBUG && console.log('fdxsxs');
        return string.replace(RegExp(`^${wrap}`), '').replace(RegExp(`${wrap}$`), '');
      }
    
      DEBUG && console.log(html_tags);
      if (html_tags == true) return `<${wrap}>${text}</${wrap}>`;
      return `${wrap}${text}${wrap}`;
    }
  
  
    function AttributeToLowerCase( text ){
      text = text.toString()
      var x = text.toLowerCase()
      DEBUG && console.log(`AttributeToLowerCase Was Called`)
      return x
    }
    
    function checkBool(x) {
      return AttributeToLowerCase(x) === 'true' || x === true;
    }
  }

})