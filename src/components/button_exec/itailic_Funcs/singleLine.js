import { 
    checkForItalicInTextNode, checkParentNode, removeITags, removeAllITags, 
    checkAllChildrenInITags
} from "./italic_funcs.js";

// Error: 이탤릭 적용후 or 이탤릭&텍스트 섞인 문자 텍스트열 선택후 'BOLD'적용시 모두 삭제됨

export default function singleLine ( range, selection, savedRange ) {
    
    console.log('/***************    싱글라인 실행    *****************/');
    let chkTextNode = true;  
    let cloneContent = range.cloneContents();
    let commonAncestor = range.commonAncestorContainer;

    //:: 하위 요소에 엘리먼트가 있는지 검사
    for( let i=0; i < cloneContent.childNodes.length; i++ ) {

        if( cloneContent.childNodes[i].nodeType === 1 ) { 
            chkTextNode = false;
            break;
        }

    }

    ( chkTextNode ) 
        ? console.log('/*** 텍스트 노드(o) ***/') 
        : console.log('/*** 엘리먼트 노드(o) ***/');

    if( chkTextNode ) { //텍스트 선택
        
        //사용자 선택한 텍스트: 텍스트 노드(o)
        let chkItalicTag = checkForItalicInTextNode( commonAncestor );
        let newElements = checkParentNode( commonAncestor );

        // 조건문1]:: 선택한 텍스트의 상위 요소에 <i>태그 있는지 선별
        if( !chkItalicTag ) { 
            console.log('/*** Text노드: 상위 i태그(x) ')
            // 사용자 선택한 텍스트: 상위 노드에 <i>태그 없음
            // 순수 텍스트 or <i>제외한 인라인 노드
            let itagEl = document.createElement('i');
            
            if( newElements.tagName === 'DIV' ) {
                range.extractContents();
                itagEl.appendChild( cloneContent )
            } else {
                itagEl.appendChild( newElements );
            }
            
            range.insertNode( itagEl );
            range.setStartBefore( itagEl );

        } else {
            console.log('/*** Text노드: 상위 i태그(o)')
            // 사용자 선택한 텍스트: 상위 노드에 <i>태그 있음.
            // <strong>,<span>과 같은 태그 사이에 <i> 있음
            // 순회 및 <i>태그 삭제
            let removedItalicTags = removeITags( commonAncestor );

        }
        
    
    } else {  // 엘리먼트,텍스트 조합
    
        let extractContent = range.extractContents();
        let chkITagsNodes = checkAllChildrenInITags( extractContent );

        // 하위 요소 <i>태그 조사
        // false: <i>태그 없는 노드가 단 1개 이상 발견 >> i태그 적용
        // true: 최상위, 그 아래 자식노드 모두 <i>태그 적용 됨 >> i태그 해제
        if( !chkITagsNodes ) {

            console.log('/*** 엘리먼트 조합노드: i태그 적용')

            // 순회하며 i태그 모두 삭제
            // 양끝에 i태그 넣기
            let removingNodes = removeAllITags( extractContent );
            let italicNode = document.createElement('i');
            italicNode.appendChild( removingNodes );
            range.insertNode( italicNode );

        } else {

            console.log('/*** 엘리먼트 조합노드: i태그 삭제')

            // 순회하며 i태그 모두 삭제
            let newElement = removeAllITags( extractContent );
            
            if( newElement.nodeType === 3 ) {
                
                let txtNode = document.createTextNode( newElement )
                range.insertNode( txtNode );
                range.setStartBefore( txtNode );
            
            } else {
                range.insertNode( newElement );
            }

        }

    } // 종료: Text노드, 엘리먼트 노드 판별 조건문

}