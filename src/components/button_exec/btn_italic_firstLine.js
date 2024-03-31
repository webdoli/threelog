export function toggleItalic() {

  const selection = window.getSelection();  
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  const selectedContent = range.extractContents();
  const startNode = range.startContainer;
  const startOffset = range.startOffset;  //첫째행, 첫째줄을 의미
  const lastIndex = selectedContent.childNodes.length - 1;
  let firstLine = false;
  let fragment = document.createDocumentFragment();
  let multiSLC = ( selectedContent.childNodes.length > 1 ) ? true : false; //여러줄 선택 or 한줄 선택


  // selectedContent의 첫 번째 항목을 앞의 노드와 병합
  // if (selectedContent.childNodes.length > 0) {

    if( !multiSLC ) {
      //한줄 선택
      console.log('한줄 선택');


    }


    if( multiSLC ) {
      //여러줄 선택
      const firstNode = selectedContent.childNodes[0];

      Array.from( firstNode.childNodes ).forEach( node => {

        let emEl = document.createElement('em');
        let previousElement = startNode.childNodes[startOffset].previousSibling;
        emEl.appendChild( node.cloneNode(true) );
        previousElement.appendChild( emEl );

      })

      Array.from(selectedContent.childNodes).forEach( (node, idx) => {

        //첫째줄 텍스트 선택일 때
        if( firstLine ) { 
    
            let fragEl = document.createDocumentFragment();
            let emEl = document.createElement('em');
            let clone = node.cloneNode( true );
            
            if( (lastIndex-1) !== idx ) {
      
              while( clone.firstChild ) {
                fragEl.appendChild( clone.firstChild );
              }
              
              emEl.appendChild( fragEl );
              clone.appendChild( emEl );
              fragment.appendChild( clone );
      
            } else {
              
              const lastNode = selectedContent.childNodes[lastIndex-1];
            
              if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
                // 마지막 노드 병합 로직
                Array.from( lastNode.childNodes ).forEach( node => {
      
                  let emEl = document.createElement('em');
                  let nextElement = startNode.childNodes[startOffset];
                  
                  emEl.appendChild( node.cloneNode(true) );
                  if( nextElement.firstChild ) nextElement.insertBefore( emEl, nextElement.firstChild );
                  
                })
        
              }
        
              range.collapse(false); // 범위를 끝점으로 이동
      
            }
            
        }
    
        //첫째줄 <Div> 선택일 때
        if( !firstLine ) {
  
          if( idx !== 0 ) {
            
            let fragEl = document.createDocumentFragment();
            let emEl = document.createElement('em');
            let clone = node.cloneNode( true );
      
            if( lastIndex !== idx ) {
      
              while( clone.firstChild ) {
                fragEl.appendChild( clone.firstChild );
              }
              
              emEl.appendChild( fragEl );
              clone.appendChild( emEl );
              fragment.appendChild( clone );
      
            } else {
              
              const lastNode = selectedContent.childNodes[lastIndex];
            
              if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
                // 마지막 노드 병합 로직
                Array.from( lastNode.childNodes ).forEach( node => {
      
                  let emEl = document.createElement('em');
                  let nextElement = startNode.childNodes[startOffset];
                  
                  emEl.appendChild( node.cloneNode(true) );
                  if( nextElement.firstChild ) nextElement.insertBefore( emEl, nextElement.firstChild );
                  
                })
        
              }
        
              range.collapse(false); // 범위를 끝점으로 이동
      
            }
          } 
        }
        
      });

      startNode.insertBefore( fragment, startNode.childNodes[startOffset]);
      // 선택 영역 재설정
      selection.removeAllRanges();

      // if( firstNode.nodeType === Node.TEXT_NODE ) {
      //   console.log('첫번째 줄: 텍스트 노드');
      //   firstLine = true;
      //   let emEl = document.createElement('em');
      //   emEl.appendChild( firstNode );
      //   fragment.appendChild( emEl );

      // } else if (firstNode.nodeType === Node.ELEMENT_NODE && (firstNode.nodeName === 'DIV' || firstNode.nodeName === 'P')) {

      //   console.log('첫번째 줄: 엘리먼트 노드');
      //   firstLine = false;
      //   Array.from( firstNode.childNodes ).forEach( node => {
      //     let emEl = document.createElement('em');
      //     let previousElement = startNode.childNodes[startOffset].previousSibling;
      //     emEl.appendChild( node.cloneNode(true) );
      //     previousElement.appendChild( emEl );

      //   })
      // }

    }
    
  }


    // Array.from(selectedContent.childNodes).forEach( (node, idx) => {

    //   //첫째줄 텍스트 선택일 때
    //   if( firstLine ) { 
  
    //       let fragEl = document.createDocumentFragment();
    //       let emEl = document.createElement('em');
    //       let clone = node.cloneNode( true );
          
    //       if( (lastIndex-1) !== idx ) {
    
    //         while( clone.firstChild ) {
    //           fragEl.appendChild( clone.firstChild );
    //         }
            
    //         emEl.appendChild( fragEl );
    //         clone.appendChild( emEl );
    //         fragment.appendChild( clone );
    
    //       } else {
            
    //         const lastNode = selectedContent.childNodes[lastIndex-1];
          
    //         if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
    //           // 마지막 노드 병합 로직
    //           Array.from( lastNode.childNodes ).forEach( node => {
    
    //             let emEl = document.createElement('em');
    //             let nextElement = startNode.childNodes[startOffset];
                
    //             emEl.appendChild( node.cloneNode(true) );
    //             if( nextElement.firstChild ) nextElement.insertBefore( emEl, nextElement.firstChild );
                
    //           })
      
    //         }
      
    //         range.collapse(false); // 범위를 끝점으로 이동
    
    //       }
          
    //   }
  
    //   //첫째줄 <Div> 선택일 때
    //   if( !firstLine ) {

    //     if( idx !== 0 ) {
          
    //       let fragEl = document.createDocumentFragment();
    //       let emEl = document.createElement('em');
    //       let clone = node.cloneNode( true );
    
    //       if( lastIndex !== idx ) {
    
    //         while( clone.firstChild ) {
    //           fragEl.appendChild( clone.firstChild );
    //         }
            
    //         emEl.appendChild( fragEl );
    //         clone.appendChild( emEl );
    //         fragment.appendChild( clone );
    
    //       } else {
            
    //         const lastNode = selectedContent.childNodes[lastIndex];
          
    //         if (lastNode.nodeType === Node.ELEMENT_NODE && (lastNode.nodeName === 'DIV' || lastNode.nodeName === 'P')) {
    //           // 마지막 노드 병합 로직
    //           Array.from( lastNode.childNodes ).forEach( node => {
    
    //             let emEl = document.createElement('em');
    //             let nextElement = startNode.childNodes[startOffset];
                
    //             emEl.appendChild( node.cloneNode(true) );
    //             if( nextElement.firstChild ) nextElement.insertBefore( emEl, nextElement.firstChild );
                
    //           })
      
    //         }
      
    //         range.collapse(false); // 범위를 끝점으로 이동
    
    //       }
    //     } 
    //   }
      
    // });

    

    // startNode.insertBefore( fragment, startNode.childNodes[startOffset]);
    // // 선택 영역 재설정
    // selection.removeAllRanges();


// }