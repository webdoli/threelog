/***********    **************/
// 『wrapChildrenInSpan 함수』 //
/***********    **************/
//:: 최상위 엘리먼트만 span으로 변경, span을 div로 변경 가능 
export function wrapChildrenInSpan( fragmentElement ) {
    // 새로운 span 요소를 생성
    const span = document.createElement('span');
    
    // fragmentElement의 모든 자식을 순회하며 span에 추가
    while ( fragmentElement.firstChild ) {
        // 첫 번째 자식 노드를 span에 옮김
        span.appendChild(fragmentElement.firstChild);
    }
    
    return span;
}


/*************************/
// 『checkParentNode함수』 //
/*************************/
//:: 상위에 <div>태그가 나올 때까지 상위 노드를 향해 순회하며, <div>태그가 나오는 바로 아래 노드를 반환 함.

export function checkParentNode ( element ) {

    let parentElement = element.nodeType === Node.TEXT_NODE ? element.parentNode : element;

    while( parentElement.parentNode ) {
        
        if( parentElement.parentNode.tagName === 'DIV' || parentElement.parentNode.tagName === 'P' ) return parentElement;
        parentElement = parentElement.parentNode;
    
    }

}


/********************************/
// checkForItalicInTextNode함수 //
/********************************/
//:: 상위에 <div>태그가 나올 때까지 상위 노드를 향해 순회하며, <i>태그가 나오면 true반환, <i>태그가 없으면 false 반환.

export function checkForItalicInTextNode ( element ) {

    let parentElement = element.nodeType === Node.TEXT_NODE ? element.parentNode : element;
    
    if( parentElement.tagName === 'I' ) { console.log('i발견'); return true; }

    while( parentElement.parentNode ) {
        
        if( parentElement.parentNode.tagName === 'I' ) return true; 
        if( parentElement.parentNode.tagName === 'DIV' ) return false;

        parentElement = parentElement.parentNode
        
    }

    
    return false;

}


/********************************/
// checkAllChildrenInITags 함수 //
/********************************/
//:: 하위 노드를 순회하며, <i>태그가 나오면 true반환, <i>태그가 없으면 false 반환.

export function checkAllChildrenInITags( divElement ) {

    // 각 최상위 하위 요소를 순회
    for (let child of divElement.childNodes) {
        
      // 각 최상위 하위 요소에 대해 <i> 태그 검사를 수행
        if (!isInITag(child)) {
            return false; // <i> 태그가 없는 요소를 발견하면 즉시 false 반환
        }
    }
    return true; // 모든 검사를 통과하면 true 반환
}

function isInITag( element ) {

    // 재귀 종료 조건: <i> 태그를 찾으면 true 반환
    if (element.tagName === 'I') return true;
    
    // 텍스트 노드이고, 부모가 <i> 태그이면 true 반환
    if (element.nodeType === Node.TEXT_NODE && element.parentNode.tagName === 'I') return true;

    // 요소 노드에 대해서는 자식 노드들을 재귀적으로 확인
    if (element.nodeType === Node.ELEMENT_NODE) {
        for (let child of element.childNodes) {
            // <i> 태그가 없는 자식 노드를 발견하면 즉시 false 반환
            if (!isInITag(child)) return false;    
        }
    }
}


/*************************/
// 『removeITags함수』 //
/*************************/
//:: 상위 <div>태그가 1개 나올 때까지 상위 노드를 향해 순회하며, <i>태그가 나오면 삭제 하며 원래 노드구조는 유지함.

export function removeITags ( element ) {

    let current = element.nodeType === Node.TEXT_NODE ? element.parentNode : element; //상위 엘리먼트 노드만 공략함
    // let frangment = document.createDocumentFragment();

    while( current.parentNode && current.parentNode.tagName !== 'DIV' ) {
        
        const parent = current.parentNode;

        if( parent.tagName === 'I' ) {
            const grandParent = parent.parentNode;
            console.log('parent: ', parent );
            console.log('grandParent: ', grandParent );
            console.log('grandParent firstChild: ', grandParent.firstChild );
            while( parent.firstChild ) {
                grandParent.insertBefore( parent.firstChild, parent );
            }

            // <i>태그 삭제
            grandParent.removeChild( parent );
        }

        current = parent;

    }

    return current;

}


/********************************/
// removeAllITags 함수 //
/********************************/
//:: 하위 노드를 순회하며, <i>태그가 나오면 삭제 후 원래 구조 반환

export function removeAllITags( element ) {

    // 재귀적으로 <i> 태그를 제거하는 함수
    function removeITags( element ) {
        if ( !element ) return;

        // NodeList를 배열로 변환하여 순회
        Array.from( element.childNodes ).forEach( child => {

            if ( child.tagName === 'I' ) {
                // <i> 태그 내용을 부모 요소에 직접 삽입
                while ( child.firstChild ) {
                    element.insertBefore( child.firstChild, child );
                }
                // <i> 태그 자체는 제거
                element.removeChild( child);
            } else {
                // 재귀적으로 자식 요소들 검사
                removeITags( child );
            }
        });

    }

    // <div> 요소부터 시작하여 <i> 태그 제거
    removeITags( element );

    // 수정된 HTML 구조를 문자열로 반환
    return element

}



/********************************/
// removeITagsNodes함수 //
/********************************/
//:: 하위 노드를 순회하며, <i>태그가 나오면 true반환, <i>태그가 없으면 false 반환.

export function removeITagsNodes ( divElement ) {

    // <i> 태그를 검사하고 삭제하는 함수
    function removeITags(element) {
        if (!element) return;
        
        // NodeList를 배열로 변환하여 순회
        Array.from(element.childNodes).forEach(child => {
            // <i> 태그를 찾으면 삭제
            if (child.tagName === 'I') {
                element.removeChild(child);
            } else {
                // 재귀적으로 하위 노드를 순회
                removeITags(child);
            }
        });
    }

    // <div> 태그의 최상위 하위 요소들에 대해 <i> 태그 검사 및 삭제 수행
    removeITags(divElement);

}


// export function checkForItalicInNodes ( element ) {

//     let parentElement = element.nodeType === Node.TEXT_NODE ? element.parentNode : element;

//     if( parentElement.tagName === 'I' ) return true;

//     while( parentElement.parentNode ) {
        
//         if( parentElement.parentNode.tagName === 'I' ) return true; 
//         if( parentElement.parentNode.tagName === 'DIV' ) return false;

//         parentElement = parentElement.parentNode

//     }

//     return false;

// }