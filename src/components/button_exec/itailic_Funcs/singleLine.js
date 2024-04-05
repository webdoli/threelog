import { 
    checkForItalicInTextNode, 
    checkParentNode, 
    removeITags, 
    removeAllITags, 
    checkForItalicInNodes, 
    checkAllChildrenInITags,
    wrapChildrenInSpan,
    removeITagsNodes,
    testFunc
} from "./italic_funcs.js";

export default function singleLine ( range, selection, savedRange ) {
    
    console.log('/***************    싱글라인 실행    *****************/');
    let chkTextNode = true;  
    let cloneContent = range.cloneContents();
    let commonAncestor = range.commonAncestorContainer;

    /*************/
    // 반복문[1] //
    /************/
    //:: 하위 요소에 엘리먼트가 있는지 검사
    for( let i=0; i < cloneContent.childNodes.length; i++ ) {

        if( cloneContent.childNodes[i].nodeType === 1 ) { 
            chkTextNode = false;
            break;
        }

    }


    if( chkTextNode ) { //텍스트 선택
        
        //사용자 선택한 텍스트: 텍스트 노드(o)
        let chkItalicTag = checkForItalicInTextNode( commonAncestor );
        let newElements = checkParentNode( commonAncestor );

        // 조건문:: 선택한 텍스트의 상위 요소에 <i>태그 있는지 선별
        if( !chkItalicTag ) { 
            
            // 사용자 선택한 텍스트: 상위 노드에 <i>태그 없음
            // 순수 텍스트 or <i>제외한 인라인 노드
            console.log('/*** 텍스트노드: 이탤릭 설정');

            let itagEl = document.createElement('i');
            console.log('newElement: ', newElements.tagName );
            if( newElements.tagName === 'DIV' ) {
                range.extractContents();
                itagEl.appendChild( cloneContent )
            } else {
                itagEl.appendChild( newElements );
            }
            
            range.insertNode( itagEl );

            selection.addRange( savedRange );

        } else {

            // 사용자 선택한 텍스트: 상위 노드에 <i>태그 있음.
            // <strong>,<span>과 같은 태그 사이에 <i> 있음
            console.log('/*** 텍스트노드: 이탤릭 삭제');

            // 순회 및 <i>태그 삭제
            let removedItalicTags = removeITags( commonAncestor );
            console.log('i삭제 결과: ', removedItalicTags );
            selection.addRange(savedRange);

        }
        
    
    } else {  // 엘리먼트,텍스트 조합
        // let xClone = cloneContent.cloneNode(true);

        let extractContent = range.extractContents();
        console.log('extractContent: ', extractContent );
        for( let i=0; i<extractContent.childNodes.length; i++) {

            console.log(`${i}: ${extractContent.childNodes[i]}`)
        }
        // let fragToSpan = wrapChildrenInSpan( cloneContent );
        // console.log('fragTospan: ', fragToSpan );
        // let chkITagsNodes = checkAllChildrenInITags( extractContent );
        // console.log('chkItagsNodes: ', chkITagsNodes );

        // if( !chkITagsNodes ) {
        //     console.log('/*** 엘리먼트 조합노드: i태그 적용')
        //     // 순회하며 i태그 모두 삭제
        //     // 양끝에 i태그 넣기
        //     // console.log('i태그 삭제한 결과 1]: ', newElement );

        //     selection.addRange(savedRange);

        // } else {
        //     console.log('/*** 엘리먼트 조합노드: i태그 삭제')

        //     // 순회하며 i태그 모두 삭제
        //     let newElement = removeAllITags( cloneContent );
        //     // console.log('i태그 삭제한 결과 2]: ', newElement );
        //     selection.addRange(savedRange);
        // }

    }

}