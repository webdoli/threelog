
export const makeImgs = ( imgEl, fileEl ) => {

    fileEl.click();
    
    fileEl.addEventListener( 'change', (event) => {

        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
            // 이미지 삽입 함수를 호출하여 커서 위치에 이미지를 삽입
                insertImageAtCursor( e.target.result );
                fileEl.value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    function insertImageAtCursor( src ) {
        
        const imgElement = document.createElement('img');
        imgElement.src = src;
        imgElement.alt = 'Inserted Image';
        imgElement.style.cssText = `width:100px; height:100px;`;
        
        const editor = document.getElementById('text-editor');
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        // const range = document.getSelection().getRangeAt(0);
        const range = selection.getRangeAt(0);
        range.deleteContents(); // 선택된 영역의 내용을 지우고

        // 이미지 크기 조절 핸들 추가
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            width:10px;height:10px;background-color:red;position:absolute;
            bottom:-5px;right:-5px;cursor:nwse-resize;`;

        const imgContainer = document.createElement('div');
        imgContainer.style.cssText =`position:relative; display:inline-block; cursor:default`;
        imgContainer.appendChild( imgElement );
        imgContainer.appendChild( resizeHandle );

        range.insertNode(imgContainer); // 이미지를 삽입합니다.

        // 이미지 크기 조절 이벤트 핸들러
        resizeHandle.addEventListener( 'mousedown', (e) => {

            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt( window.getComputedStyle( imgElement ).width, 10) ;
            const startHeight = parseInt( window.getComputedStyle( imgElement ).height, 10 );
        
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
}