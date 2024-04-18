import ITextButton from "./i_ctrl_text_button.js";

class Text_Button_Italic extends ITextButton {
    
    constructor() {

        super();
        this.originalRange = null;
        this.cloneNodes = null;
        this.extractNodes = null;
        this.chkMultiLineValue = null;
        this.removeRange = null;
        this.newSelect = false;
        this.newSelectNodeType = null;
    }

    init() {
        
        if( this.range ) {

            this.originalRange = this.range.cloneRange();
            this.originalRange_s = [];
            
            this.startContainer = this.range.startContainer;
            this.startOffset = this.range.startOffset;
            
            this.endContainer = this.range.endContainer;
            this.endOffset = this.range.endOffset;
            
            this.clone();
            this.chkMultiLine();
            
        }

    }

    execute(){
        
        this.init();

        if( this.chkMultiLineValue ) {
            // 멀티라인
            console.log('/-------- 멀티 라인 --------/');
            ( this.isItalicApplied( this.range, "SPAN", "italic" ) ) 
                ? this.removeItalicStyleFromRange_m(this.range, "italic") 
                : this.styleTextNodesInRange_m(this.range );

                this.resetRange( this.originalRange, this.newSelect );

        } else {
            // 단일라인
            console.log('/------- 단일 라인 -------/');

            // let extractNodes = this.extract();
            // console.log('extract: ', extractNodes );
            // console.log('extract.parentNode: ', extractNodes.parentNode );

            if ( this.isItalicApplied( this.range, "SPAN", "italic" ) ) {
                console.log('이탤릭 제거');
                this.removeItalicStyleFromRange_s( this.range, "italic" );
                if( this.removeRange ) {
                    // console.log(`removeRange: ${this.removeRange}, newSelect: ${this.newSelect}` );
                    console.log('2] this.originalRange: ', this.originalRange );
                    this.resetRange( this.originalRange, this.newSelect );
                }
            
            } else {
                console.log('이탤릭 생성');
                this.styleTextNodesInRange_s(this.range );
            
                if( this.originalRange_s ) {
                
                    let len = this.originalRange_s.length - 1;
                    this.originalRange.setStartBefore( this.originalRange_s[0] );
                    this.originalRange.setEndAfter( this.originalRange_s[len]);
                    this.resetRange( this.originalRange, this.newSelect );
                    
                }
            
            }
            
        }
    }

    resetRange( range, newSelect ) {
        console.log('newSelect: ', newSelect );
        if( newSelect ) {
            // range = document.createRange();
            console.log('range: ', range );
            this.selection.removeAllRanges();
            this.selection.addRange( range );
        } else {
            this.selection.removeAllRanges();
            this.selection.addRange( range );
        }
        
    }

    // 싱글라인
    styleTextNodesInRange_s(range) {
        
        let currentNode = range.startContainer;

        if ( currentNode.nodeType !== Node.TEXT_NODE ) {
            
            let child = currentNode.firstChild;
            while (child && child.nodeType !== Node.TEXT_NODE) {
                child = child.nextSibling;
            }
            currentNode = child; // 첫 번째 텍스트 노드로 설정
        }
    
        if (!currentNode) {
            console.log("No text nodes found in the selection.");
            return;
        }
    
    
        const walker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
    
        walker.currentNode = currentNode;
    
        let node = walker.currentNode; // 시작 노드 설정
        let nodes = [];
        do {
            if (node && range.intersectsNode(node)) {
                nodes.push(node);
            }
        } while ((node = walker.nextNode()) && node !== range.endContainer.nextSibling);
    
        nodes.forEach(node => {
            
            let textRange = document.createRange();
            textRange.selectNodeContents(node);
            
            if (node === range.startContainer) {
                
                textRange.setStart(node, range.startOffset);
                
            }
            if (node === range.endContainer) {
        
                textRange.setEnd(node, range.endOffset);
            } 
    
            this.wrapTextWithSpan_s(textRange, 'span', 'italic' );
            this.originalRange = textRange;
        });
    }
    

    wrapTextWithSpan_s( textRange, tag, fontStyle ) {
 
        const el = document.createElement(tag);
        el.style.fontStyle = fontStyle;
        el.classList.add( fontStyle ); // 이탤릭체를 적용하는 <span>에 클래스 추가
        const contents = textRange.extractContents();
        
        el.appendChild(contents);
        textRange.insertNode(el);
        
        textRange.selectNode( el );
        this.originalRange_s.push( el );

    }

    styleTextNodesInRange_m( range ) {
        const startContainer = range.startContainer;
        const endContainer = range.endContainer;
        const startOffset = range.startOffset;
        const endOffset = range.endOffset;

        const walker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node, nodes = [];
        while ((node = walker.nextNode())) {
            nodes.push(node);
        }

        nodes.forEach(node => {
            if (range.intersectsNode(node)) {
                let textRange = document.createRange();
                textRange.selectNode(node);

                if (node === startContainer) {
                    textRange.setStart(node, startOffset);
                }
                if (node === endContainer) {
                    textRange.setEnd(node, endOffset);
                }

                this.wrapTextWithSpan_m( textRange, 'span', 'italic' );
            }
        });
    }

    wrapTextWithSpan_m( textRange, tag, name ) {

        const el = document.createElement( tag );
        el.style.fontStyle = name;
        el.classList.add( name ); // 이탤릭체를 적용하는 <span>에 클래스 추가
        const contents = textRange.extractContents();
        el.appendChild( contents );
        textRange.insertNode(el);

    }

    removeItalicStyleFromRange_m( range, fontStyle ) {

        const walker = this.removeWalker( range, fontStyle );
        const spans = [];
        let node;
        while ((node = walker.nextNode())) spans.push(node);
    
        // 역순으로 처리하여 DOM 변경시 이슈 방지
        for (let i = spans.length - 1; i >= 0; i--) {
            this.unwrapSpanFromText( spans[i], fontStyle );
        }
    }

    removeWalker( range, fontStyle ) {

        let ancestorContainer = range.commonAncestorContainer;

        // commonAncestorContainer가 요소 노드가 아니면 상위로 올라가며 검사
        while ( ancestorContainer && ancestorContainer.nodeType !== Node.ELEMENT_NODE) {
            ancestorContainer = ancestorContainer.parentNode;
        }

        // 최상위 div 또는 다른 적절한 컨테이너 요소 찾기
        while ( ancestorContainer && ancestorContainer.tagName !== 'DIV' ) {
            ancestorContainer = ancestorContainer.parentNode;
        }

        const walker = document.createTreeWalker(
            ancestorContainer,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {

                    return node.tagName === "SPAN" && node.style.fontStyle === fontStyle
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_SKIP;
                }
            },
            false
        );

        return walker
    }


    removeItalicStyleFromRange_s( range, fontStyle ) {
        console.log('단일 제거');
        
        let cloneNode = this.clone();
        this.removeRange = cloneNode;
        console.log('this.newSelectNodeType: ', this.newSelectNodeType)
        if( this.newSelectNodeType ) {
            console.log('시발')
            if ( cloneNode.nodeType === 11 ) { 
                this.newSelect = true;
                
                range.setStartBefore( cloneNode.firstChild );
                range.setEndAfter( cloneNode.lastChild );
            } else { 
                this.newSelect = false;
            }
        }
        
        const walker = this.removeWalker( range, fontStyle );
        const spans = [];
        let node;
        while ((node = walker.nextNode())) spans.push(node);
        // 역순으로 처리하여 DOM 변경시 이슈 방지
        for (let i = spans.length - 1; i >= 0; i--) {
            this.unwrapSpanFromText( spans[i], fontStyle );
        }
        
    }
    

    unwrapSpanFromText( node, fontStyle ) {
        // console.log('node: ', node );
        if (node.tagName === "SPAN" && node.classList.contains(fontStyle)) {
            const parent = node.parentNode;
            
            if( parent ) {

                while (node.firstChild) {
                    parent.insertBefore(node.firstChild, node);
                }
                parent.removeChild(node);

            }
        }
        
    }

    isItalicApplied(range, tag, fontStyle) {
        
        let ancestorContainer = range.commonAncestorContainer;
        // commonAncestorContainer가 요소 노드가 아니면 상위로 올라가며 검사
        while ( ancestorContainer && ancestorContainer.nodeType !== Node.ELEMENT_NODE) {
            ancestorContainer = ancestorContainer.parentNode;
            
        }

        // 최상위 div 또는 다른 적절한 컨테이너 요소 찾기
        while ( ancestorContainer && ancestorContainer.tagName !== 'DIV' ) {
            ancestorContainer = ancestorContainer.parentNode;
            this.newSelect = true;
        }
    
        // 범위가 텍스트 노드만을 포함할 경우와 요소를 포함할 경우 모두 처리할 수 있도록 로직 조정
        const walker = document.createTreeWalker(
            ancestorContainer,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    // NodeFilter를 사용하여 특정 스타일이 적용된 태그만 필터링
                    if (node.tagName === tag && node.style.fontStyle === fontStyle) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            },
            false
        );
    
        // walker를 사용하여 실제로 해당 스타일이 적용된 요소가 있는지 확인
        const isApplied = walker.nextNode() !== null;
        console.log('Is Italic Applied: ', isApplied);
        return isApplied;
    }

    // 멀티라인, 싱글라인 체크
    chkMultiLine() {

        let selectedText = this.selection.toString();

        if( this.cloneNodes ) {
            this.chkMultiLineValue = ( selectedText.split('\n').length > 1 ) ? true : false;
        }

    }

    extract() {
        if( this.range ) this.extractNodes = this.range.extractContents();
        return this.extractNodes;
    }

    clone() {

        if ( this.range ) this.cloneNodes = this.range.cloneContents();
        return this.cloneNodes;
    
    }

}

export default Text_Button_Italic


// import ITextButton from "./i_ctrl_text_button.js";

// class Text_Button_Italic extends ITextButton {
    
//     constructor() {

//         super();
//         this.originalRange = null;
//         this.cloneNodes = null;
//         this.chkMultiLineValue = null;
//         this.removeRange = null;
//         this.newSelect = false;
//         this.newSelectNodeType = null;
//     }

//     init() {
        
//         if( this.range ) {

//             this.originalRange = this.range.cloneRange();
//             this.originalRange_s = [];
            
//             this.startContainer = this.range.startContainer;
//             this.startOffset = this.range.startOffset;
            
//             this.endContainer = this.range.endContainer;
//             this.endOffset = this.range.endOffset;
            
//             this.clone();
//             this.chkMultiLine();
            
//         }

//     }

//     execute(){
        
//         this.init();

//         if( this.chkMultiLineValue ) {
//             // 멀티라인
//             console.log('/-------- 멀티 라인 --------/');
//             ( this.isItalicApplied( this.range, "SPAN", "italic" ) ) 
//                 ? this.removeItalicStyleFromRange_m(this.range, "italic") 
//                 : this.styleTextNodesInRange_m(this.range );

//                 this.resetRange( this.originalRange, this.newSelect );

//         } else {
//             // 단일라인
//             console.log('/------- 단일 라인 -------/');

//             if ( this.isItalicApplied( this.range, "SPAN", "italic" ) ) {
//                 console.log('이탤릭 제거');
//                 this.removeItalicStyleFromRange_s( this.range, "italic" );
//                 if( this.removeRange ) {
//                     // console.log(`removeRange: ${this.removeRange}, newSelect: ${this.newSelect}` );
//                     console.log('2] this.originalRange: ', this.originalRange );
//                     this.resetRange( this.originalRange, this.newSelect );
//                 }
            
//             } else {
//                 console.log('이탤릭 생성');
//                 this.styleTextNodesInRange_s(this.range );
            
//                 if( this.originalRange_s ) {
                
//                     let len = this.originalRange_s.length - 1;
//                     this.originalRange.setStartBefore( this.originalRange_s[0] );
//                     this.originalRange.setEndAfter( this.originalRange_s[len]);
//                     this.resetRange( this.originalRange, this.newSelect );
                    
//                 }
            
//             }
            
//         }
//     }

//     resetRange( range, newSelect ) {
//         console.log('newSelect: ', newSelect );
//         if( newSelect ) {
//             // range = document.createRange();
//             console.log('range: ', range );
//             this.selection.removeAllRanges();
//             this.selection.addRange( range );
//         } else {
//             this.selection.removeAllRanges();
//             this.selection.addRange( range );
//         }
        
//     }

//     // 싱글라인
//     styleTextNodesInRange_s(range) {
        
//         let currentNode = range.startContainer;

//         if ( currentNode.nodeType !== Node.TEXT_NODE ) {
            
//             let child = currentNode.firstChild;
//             while (child && child.nodeType !== Node.TEXT_NODE) {
//                 child = child.nextSibling;
//             }
//             currentNode = child; // 첫 번째 텍스트 노드로 설정
//         }
    
//         if (!currentNode) {
//             console.log("No text nodes found in the selection.");
//             return;
//         }
    
    
//         const walker = document.createTreeWalker(
//             range.commonAncestorContainer,
//             NodeFilter.SHOW_TEXT,
//             null,
//             false
//         );
    
//         walker.currentNode = currentNode;
    
//         let node = walker.currentNode; // 시작 노드 설정
//         let nodes = [];
//         do {
//             if (node && range.intersectsNode(node)) {
//                 nodes.push(node);
//             }
//         } while ((node = walker.nextNode()) && node !== range.endContainer.nextSibling);
    
//         nodes.forEach(node => {
            
//             let textRange = document.createRange();
//             textRange.selectNodeContents(node);
            
//             if (node === range.startContainer) {
                
//                 textRange.setStart(node, range.startOffset);
                
//             }
//             if (node === range.endContainer) {
        
//                 textRange.setEnd(node, range.endOffset);
//             } 
    
//             this.wrapTextWithSpan_s(textRange, 'span', 'italic' );
//             this.originalRange = textRange;
//         });
//     }
    

//     wrapTextWithSpan_s( textRange, tag, fontStyle ) {
 
//         const el = document.createElement(tag);
//         el.style.fontStyle = fontStyle;
//         el.classList.add( fontStyle ); // 이탤릭체를 적용하는 <span>에 클래스 추가
//         const contents = textRange.extractContents();
        
//         el.appendChild(contents);
//         textRange.insertNode(el);
        
//         textRange.selectNode( el );
//         this.originalRange_s.push( el );

//     }

//     styleTextNodesInRange_m( range ) {
//         const startContainer = range.startContainer;
//         const endContainer = range.endContainer;
//         const startOffset = range.startOffset;
//         const endOffset = range.endOffset;

//         const walker = document.createTreeWalker(
//             range.commonAncestorContainer,
//             NodeFilter.SHOW_TEXT,
//             null,
//             false
//         );

//         let node, nodes = [];
//         while ((node = walker.nextNode())) {
//             nodes.push(node);
//         }

//         nodes.forEach(node => {
//             if (range.intersectsNode(node)) {
//                 let textRange = document.createRange();
//                 textRange.selectNode(node);

//                 if (node === startContainer) {
//                     textRange.setStart(node, startOffset);
//                 }
//                 if (node === endContainer) {
//                     textRange.setEnd(node, endOffset);
//                 }

//                 this.wrapTextWithSpan_m( textRange, 'span', 'italic' );
//             }
//         });
//     }

//     wrapTextWithSpan_m( textRange, tag, name ) {

//         const el = document.createElement( tag );
//         el.style.fontStyle = name;
//         el.classList.add( name ); // 이탤릭체를 적용하는 <span>에 클래스 추가
//         const contents = textRange.extractContents();
//         el.appendChild( contents );
//         textRange.insertNode(el);

//     }

//     removeItalicStyleFromRange_m( range, fontStyle ) {

//         const walker = this.removeWalker( range, fontStyle );
//         const spans = [];
//         let node;
//         while ((node = walker.nextNode())) spans.push(node);
    
//         // 역순으로 처리하여 DOM 변경시 이슈 방지
//         for (let i = spans.length - 1; i >= 0; i--) {
//             this.unwrapSpanFromText( spans[i], fontStyle );
//         }
//     }

//     removeWalker( range, fontStyle ) {

//         let ancestorContainer = range.commonAncestorContainer;

//         // commonAncestorContainer가 요소 노드가 아니면 상위로 올라가며 검사
//         while ( ancestorContainer && ancestorContainer.nodeType !== Node.ELEMENT_NODE) {
//             ancestorContainer = ancestorContainer.parentNode;
//         }

//         // 최상위 div 또는 다른 적절한 컨테이너 요소 찾기
//         while ( ancestorContainer && ancestorContainer.tagName !== 'DIV' ) {
//             ancestorContainer = ancestorContainer.parentNode;
//         }

//         const walker = document.createTreeWalker(
//             ancestorContainer,
//             NodeFilter.SHOW_ELEMENT,
//             {
//                 acceptNode: function(node) {

//                     return node.tagName === "SPAN" && node.style.fontStyle === fontStyle
//                         ? NodeFilter.FILTER_ACCEPT
//                         : NodeFilter.FILTER_SKIP;
//                 }
//             },
//             false
//         );

//         return walker
//     }


//     removeItalicStyleFromRange_s( range, fontStyle ) {
//         console.log('단일 제거');
        
//         let cloneNode = this.clone();
//         this.removeRange = cloneNode;
//         console.log('this.newSelectNodeType: ', this.newSelectNodeType)
//         if( this.newSelectNodeType ) {
//             console.log('시발')
//             if ( cloneNode.nodeType === 11 ) { 
//                 this.newSelect = true;
                
//                 range.setStartBefore( cloneNode.firstChild );
//                 range.setEndAfter( cloneNode.lastChild );
//             } else { 
//                 this.newSelect = false;
//             }
//         }
        
//         const walker = this.removeWalker( range, fontStyle );
//         const spans = [];
//         let node;
//         while ((node = walker.nextNode())) spans.push(node);
//         // 역순으로 처리하여 DOM 변경시 이슈 방지
//         for (let i = spans.length - 1; i >= 0; i--) {
//             this.unwrapSpanFromText( spans[i], fontStyle );
//         }
        
//     }
    

//     unwrapSpanFromText( node, fontStyle ) {
//         // console.log('node: ', node );
//         if (node.tagName === "SPAN" && node.classList.contains(fontStyle)) {
//             const parent = node.parentNode;
            
//             if( parent ) {

//                 while (node.firstChild) {
//                     parent.insertBefore(node.firstChild, node);
//                 }
//                 parent.removeChild(node);

//             }
//         }
        
//     }

//     isItalicApplied(range, tag, fontStyle) {
        
//         let ancestorContainer = range.commonAncestorContainer;
//         // commonAncestorContainer가 요소 노드가 아니면 상위로 올라가며 검사
//         while ( ancestorContainer && ancestorContainer.nodeType !== Node.ELEMENT_NODE) {
//             ancestorContainer = ancestorContainer.parentNode;
            
//         }

//         // 최상위 div 또는 다른 적절한 컨테이너 요소 찾기
//         while ( ancestorContainer && ancestorContainer.tagName !== 'DIV' ) {
//             ancestorContainer = ancestorContainer.parentNode;
//             this.newSelect = true;
//         }
    
//         // 범위가 텍스트 노드만을 포함할 경우와 요소를 포함할 경우 모두 처리할 수 있도록 로직 조정
//         const walker = document.createTreeWalker(
//             ancestorContainer,
//             NodeFilter.SHOW_ELEMENT,
//             {
//                 acceptNode: function(node) {
//                     // NodeFilter를 사용하여 특정 스타일이 적용된 태그만 필터링
//                     if (node.tagName === tag && node.style.fontStyle === fontStyle) {
//                         return NodeFilter.FILTER_ACCEPT;
//                     }
//                     return NodeFilter.FILTER_SKIP;
//                 }
//             },
//             false
//         );
    
//         // walker를 사용하여 실제로 해당 스타일이 적용된 요소가 있는지 확인
//         const isApplied = walker.nextNode() !== null;
//         console.log('Is Italic Applied: ', isApplied);
//         return isApplied;
//     }

//     // 멀티라인, 싱글라인 체크
//     chkMultiLine() {

//         let selectedText = this.selection.toString();

//         if( this.cloneNodes ) {
//             this.chkMultiLineValue = ( selectedText.split('\n').length > 1 ) ? true : false;
//         }

//     }

//     clone() {

//         if ( this.range ) this.cloneNodes = this.range.cloneContents();
//         return this.cloneNodes;
    
//     }

// }

// export default Text_Button_Italic