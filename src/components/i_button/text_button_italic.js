import ITextButton from "./i_ctrl_text_button.js";

class Text_Button_Italic extends ITextButton {
    
    constructor() {

        super();
        this.originalRange = null;
        this.cloneNodes = null;
        this.chkMultiLineValue = null;

    }

    init() {
        
        if( this.range ) {

            this.originalRange = this.range.cloneRange();
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
            console.log('멀티 라인');
            ( this.isItalicApplied( this.range ) ) 
                ? this.removeItalicStyleFromRange(this.range) 
                : this.styleTextNodesInRange(this.range );

        } else {
            // 단일라인
            console.log('단일 라인');
            ( this.isItalicApplied( this.range ) ) 
                ? this.removeItalicStyleFromRange(this.range) 
                : this.styleTextNodesInRange_s(this.range );
        }
        
        this.selection.removeAllRanges();
        this.selection.addRange( this.originalRange );

    }

    // 싱글라인
    styleTextNodesInRange_s(range) {
        console.log('단일라인 함수 시작');
        let currentNode = range.startContainer;
    
        if (currentNode.nodeType !== Node.TEXT_NODE) {
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
    
        console.log('nodes:', nodes);
    
        nodes.forEach(node => {
            let textRange = document.createRange();
            textRange.selectNodeContents(node);
    
            if (node === range.startContainer) {
                textRange.setStart(node, range.startOffset);
            }
            if (node === range.endContainer) {
                textRange.setEnd(node, range.endOffset);
            }
    
            this.wrapTextWithSpan_s(textRange);
        });
    }
    

    wrapTextWithSpan_s( textRange ) {

        const span = document.createElement("span");
        span.style.fontStyle = "italic";
        span.classList.add("italic"); // 이탤릭체를 적용하는 <span>에 클래스 추가
        const contents = textRange.extractContents();
        for( let i = 0; i < contents.childNodes.length; i++ ) {
            console.log(contents.childNodes[i] );
        }
        span.appendChild(contents);
        textRange.insertNode(span);

    }

    styleTextNodesInRange( range ) {
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

                this.wrapTextWithSpan( textRange );
            }
        });
    }

    wrapTextWithSpan( textRange ) {
        const span = document.createElement("span");
        span.style.fontStyle = "italic";
        span.classList.add("italic"); // 이탤릭체를 적용하는 <span>에 클래스 추가
        const contents = textRange.extractContents();
        span.appendChild(contents);
        textRange.insertNode(span);
    }

    removeItalicStyleFromRange( range ) {

        const walker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    return node.tagName === "SPAN" && node.style.fontStyle === "italic"
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_SKIP;
                }
            },
            false
        );
    
        const spans = [];
        let node;
        while ((node = walker.nextNode())) spans.push(node);
    
        // 역순으로 처리하여 DOM 변경시 이슈 방지
        for (let i = spans.length - 1; i >= 0; i--) {
            this.unwrapSpanFromText( spans[i] );
        }
    }

    unwrapSpanFromText( node ) {

        if (node.tagName === "SPAN" && node.classList.contains("italic")) {
            const parent = node.parentNode;
            while (node.firstChild) {
                parent.insertBefore(node.firstChild, node);
            }
            parent.removeChild(node);
        }

    }

    isItalicApplied ( range ) {
        
        const walker = document.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: function(node) {
                    return node.tagName === "SPAN" && node.style.fontStyle === "italic"
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_SKIP;
                }
            },
            false
        );
    
        return walker.nextNode() !== null; // 하나라도 이탤릭 적용된 span이 있으면 true 반환
        
    }



    // 멀티라인, 싱글라인 체크
    chkMultiLine() {

        let selectedText = this.selection.toString();

        if( this.cloneNodes ) {
            this.chkMultiLineValue = ( selectedText.split('\n').length > 1 ) ? true : false;
        }

    }

    clone() {

        if ( this.range ) this.cloneNodes = this.range.cloneContents();
    
    }

}

export default Text_Button_Italic