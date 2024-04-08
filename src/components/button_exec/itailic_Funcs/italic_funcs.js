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


/********************************/
// removeITagsNodes함수 //
/********************************/
//:: 하위 노드를 순회하며, <i>태그가 나오면 true반환, <i>태그가 없으면 false 반환.

export function removeEmptyTag( container ) {

    const tags = container.querySelectorAll('*');
    
    tags.forEach( tag => {
        if ( tag.textContent.trim().length === 0) { // 공백 텍스트 노드일 경우 삭제
            tag.parentNode.removeChild( tag );
        }
    });
}

// 하위요소 빈태그 삭제하기
export function removeEmptyTags( contents ) {
    // console.log('remove제거: ', contents );
    contents.childNodes.forEach( node => {
        
        if( node.nodeType === Node.ELEMENT_NODE ) {
            // console.log('node: ', node );
            node.querySelectorAll("*").forEach( ( element, idx )=> {
                console.log('엘리멘트: ', element );
                console.log('firstChild: ', element.firstChild );
                // if( element.innerHTML.trim() === "" && element.children.length === 0 ) {
                //     console.log('엘리먼트 제거: ', element )
                //     element.parentNode.removeChild( element );
                //     idx--;

                // }

            })
            // node.querySelectorAll('*').forEach( element => {
            //     // 요소가 빈 태그인지 확인합니다. (textContent가 없고, 자식 요소도 없는 경우)
            //     if (!element.textContent.trim() && element.children.length === 0) {
            //         // 빈 태그라면, 부모 요소로부터 해당 태그를 삭제합니다.
            //         console.log('빈태그 발견 삭제: ', element );
            //         element.parentNode.removeChild(element);
            //     }
            // });
        }
        
    });

    return contents;

}

// 하위요소와 그 자식노드 중에서 빈태그 찾아서 제거하기
export function removeEmptyNodes(node) {
    Array.from(node.childNodes).forEach(child => {
        // 자식 노드가 요소 노드인지 확인
        if (child.nodeType === Node.ELEMENT_NODE) {
            // 자식 노드가 비어있지 않은지 확인: 텍스트가 있거나, 자식 요소가 있는 경우
            if (!child.textContent.trim() && child.children.length === 0) {
                // 비어 있는 요소 노드만 제거
                node.removeChild(child);
            } else {
                // 재귀적으로 자식 노드 검사
                removeEmptyNodes(child);
            }
        }
    });
}

// 노드 아래 <i>태그만 찾아서 모두 삭제(텍스트는 유지)
export function removeITagsAndPreserveText( parentNode ) {

    let res = parentNode
    const iTags = parentNode.querySelectorAll('i');

    iTags.forEach( iTag => {
        // `<i>` 태그의 모든 자식 노드를 순회하면서 부모 노드로 이동
        while (iTag.firstChild) {
            iTag.parentNode.insertBefore(iTag.firstChild, iTag);
        }

        // 모든 자식 노드 이동 후, `<i>` 태그 자체를 삭제
        iTag.parentNode.removeChild(iTag);
    });

    return res
}


/**********************************/
// chkMultiLineItalicRemoved 함수 //
/**********************************/
// 여러줄일때, 첫번째 노드에 <i>가 있는지 유무 판단
export function chkMultiLineItalicRemoved ( nodes ) {
    
    let allNode = nodes.childNodes;
    let lastLen = allNode.length - 1;
    let lastNodeLen = allNode[lastLen].childNodes.length - 1;
    let firstNode = ( allNode[0].nodeType === Node.ELEMENT_NODE ) ? allNode[0].childNodes[0] : null;
    let lastNode = allNode[lastLen].childNodes[lastNodeLen];
    let removeItalic = false;
    let startEndItalic = false;
   
    if( firstNode ) {

        if( firstNode.nodeType === Node.ELEMENT_NODE && lastNode.nodeType === Node.ELEMENT_NODE )  { startEndItalic = true; }
        if( startEndItalic ) {
            if( firstNode.querySelectorAll('i') !== null && lastNode.querySelectorAll('i') !== null ) removeItalic = true;
        } 

        if( startEndItalic && removeItalic ) {

            nodes.childNodes.forEach( (node, idx) => {
                // 중간값 계산
                if( idx !== 0 && idx !== lastLen ) {
                    // 텍스트 노드가 하나라도 나오면 아웃 removeItalic = false
                    // console.log('중간 연산 node: ', node );
                    for( let i=0; i < node.childNodes.length; i++ ) {

                        if( removeItalic ) {

                            let tag = node.childNodes[i]; 

                            if( tag.nodeType !== Node.ELEMENT_NODE || tag.nodeType === Node.TEXT_NODE ) {
                                removeItalic = false;
                                break;
                            } else if( tag.querySelectorAll('i') === null ) {
                                // 엘리먼트 노드 중에서 i가 없는게 하나라도 있으면 아웃 removeItalic = false
                                removeItalic = false;
                                break;
                            } else {
                                // 그외 i가 모두 존재 >> 이탤릭체 제거 removeItalic = true
                                removeItalic = true;
                                // console.log('이탤릭 삭제 가능 removeItalic: ', removeItalic )
                            }

                        }
                    
                    }

                }
            });

        }
    }
    
    // console.log('최종 removeItalic: ', removeItalic )
    return removeItalic

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