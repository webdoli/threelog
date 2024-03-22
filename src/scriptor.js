/**!
 * @license Scriptor.js - A library for building your own custom text editors
 * LICENSED UNDER MIT LICENSE
 * MORE INFO CAN BE FOUND AT https://github.com/MarketingPipeline/Scriptor.js/
 */

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
  
    // carot / last type postion
    let startPosition = 0;
    let currentTextPosition = 0;
  
  
    form.addEventListener('mouseup', (e) => {
  
      setTimeout(() => {
        let selectedTextLength = window.getSelection().toString().length;
        let anchorPos = window.getSelection().anchorOffset;

        ( selectedTextLength > 0 ) 
          ? currentTextPosition = window.getSelection().anchorOffset + selectedTextLength
          : currentTextPosition = window.getSelection().anchorOffset;

        console.log('현재 마우스 포지션: ', currentTextPosition );

      }, 0 )
  
    })
  
    form.addEventListener('input', () => {
      
      const selection = window.getSelection();
      if (!selection.rangeCount) return; // 선택된 텍스트가 없으면 반환
      const range = selection.getRangeAt(0);
      const endPosition = range.endOffset;
      // console.log(`선택 끝 위치: ${endPosition}`);
    
    });
  
    /// Load any default text area content
    window.addEventListener('load', function (e) {
      // This prevents the window from reloading
    
      let input = form.value;
    });
  
    /// Get all Text Editor Button Values

    const buttons = document.querySelectorAll('[data-scriptor-btn]');
    buttons.forEach((button) => button.addEventListener('click', (e) => handleClick(button, form)));

    function handleClick( button, form ) {
      
      // 버튼의 데이터를 확인하여 'Bold' 기능 실행
      if (button.getAttribute('value') === 'b' && button.getAttribute('htmltags') === 'True') {
        makeTextBold();
      } else {
          // 다른 버튼에 대한 기존 처리...
          form.value = getNewValue(button, form.textContent);
      }

    }

    function makeTextBold() {
      const selection = window.getSelection();
      if (!selection.rangeCount) return; // 선택된 텍스트가 없으면 반환
    
      let range = selection.getRangeAt(0);
      if (range.collapsed) return; // 텍스트가 선택되지 않았으면 반환
      
    
      // 선택된 범위 내의 모든 노드를 순회하면서 <b> 태그를 찾아 처리
      const containsBold = Array.from(range.cloneContents().childNodes).some(node => {
        return node.nodeName === 'B' || node.querySelector && node.querySelector('b');
      });

      console.log( range.cloneContents().childNodes );
    
      if (containsBold) {
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

    // 이미지 삽입 함수
    document.getElementById('insertImage').addEventListener('click', function() {
      document.getElementById('imageUpload').click();
  });
  
  document.getElementById('imageUpload').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
              // 이미지 삽입 함수를 호출하여 커서 위치에 이미지를 삽입
              insertImageAtCursor(e.target.result);
              document.getElementById('imageUpload').value = '';
          };
          reader.readAsDataURL(file);
      }
  });
  
  function insertImageAtCursor(src) {
      const imgElement = document.createElement('img');
      
      imgElement.src = src;
      imgElement.alt = 'Inserted Image';
      imgElement.style.width = '100px';
      imgElement.style.height = '100px';
      imgElement.style.cursor = 'pointer';
  
      const editor = document.getElementById('text-editor');
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
      // const range = document.getSelection().getRangeAt(0);
      const range = selection.getRangeAt(0);
      range.deleteContents(); // 선택된 영역의 내용을 지우고

      
      // range.setStartAfter(imgElement);


      // 이미지 크기 조절 핸들 추가
      const resizeHandle = document.createElement('div');
      resizeHandle.style.width = '10px';
      resizeHandle.style.height = '10px';
      resizeHandle.style.backgroundColor = 'red';
      resizeHandle.style.position = 'absolute';
      resizeHandle.style.bottom = '-5px';
      resizeHandle.style.right = '-5px';
      resizeHandle.style.cursor = 'nwse-resize';
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.display = 'inline-block';
      imgContainer.style.bolder = '2px solid red';
      imgContainer.appendChild(imgElement);
      imgContainer.appendChild(resizeHandle);
      // editor.appendChild(imgContainer);

      range.insertNode(imgContainer); // 이미지를 삽입합니다.

      // 이미지 크기 조절 이벤트 핸들러
      resizeHandle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = parseInt(window.getComputedStyle(imgElement).width, 10);
        const startHeight = parseInt(window.getComputedStyle(imgElement).height, 10);
      
        function resize(e) {
            const width = startWidth + e.clientX - startX;
            const height = startHeight + e.clientY - startY;
            imgElement.style.width = `${width}px`;
            imgElement.style.height = `${height}px`;
        }
      
        function stopResize() {
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
        }
      
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
      
      // 이미지 드래그 이벤트 설정
      imgContainer.addEventListener('dragstart', handleDragStart, false);
      editor.addEventListener('dragover', handleDragOver, false);
      editor.addEventListener('drop', handleDrop, false);
  }
  
  function handleDragStart(e) {
      e.dataTransfer.setData('text/plain', null); // Firefox를 위한 해결책
      e.dataTransfer.setDragImage(this, 0, 0);
      e.dataTransfer.effectAllowed = 'move';
      window.draggedElement = this; // 드래그된 이미지를 전역 변수로 설정
  }
  
  function handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  }
  
  function handleDrop(e) {
      e.stopPropagation(); // 이벤트 전파 중지
      e.preventDefault();
      
      const range = document.caretRangeFromPoint(e.clientX, e.clientY);
      if (range) {
          range.insertNode(window.draggedElement); // 드래그된 이미지를 새 위치에 삽입
          const sel = window.getSelection();
          sel.removeAllRanges(); // 선택 영역 제거
          sel.addRange(range); // 이미지 뒤에 새 선택 영역 생성
      }
  }
  
    function getNewValue( button, text ) {
        // allows custom functions to be called on button clicks.
        console.log('text: ', text );
      if ( button.getAttribute("custom-function") ) eval( button.getAttribute("custom-function") )

      // for each value - check if type is true or false. 
      const [insert, htmltags, wrap] = ['insert', 'htmltags', 'wrap'].map( (key) => checkBool(button.getAttribute(key) ?? defaultButtonProps[key]));
      const value = button.getAttribute('value') ?? defaultButtonProps['value'];
      DEBUG && console.table({ insert, value, htmltags, wrap });
    
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
    
      if (getSelectionText() != '') {
        console.log('getSelectionText: ', getSelectionText() );
        if (wrap) {
          console.log('value: ', value );
          if (htmltags) return text.replace( getSelectionText(), wrapText( getSelectionText(), value ));
          // Not wrapping with html tags <>
          return text.replace(getSelectionText(), wrapText(getSelectionText(), value, false));
        } else {
          // replace first HTML tag
          if (getSelectionText().startsWith(value)) return text.replace(value, '');
        
          // Add to the start of the value
          return form.value.replace(getSelectionText(), value + getSelectionText());
        }
      }
    }
  
    /// This will return the highlighted text on screen.

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
  
  
    function AttributeToLowerCase(text){
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


