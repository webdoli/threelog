import ITextButton from "./i_ctrl_text_button.js";

function styleTextNodesInRange( range ) {
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

            wrapTextWithSpan(textRange);
        }
    });
}

function wrapTextWithSpan(textRange) {
    const span = document.createElement("span");
    span.style.fontStyle = "italic";
    const contents = textRange.extractContents();
    span.appendChild(contents);
    textRange.insertNode(span);
}


class Text_Button_Italic extends ITextButton {
    
    constructor() {

        super();

        this.originalRange = null;
        this.cloneNodes = null;
        this.extractNodes = null;
        this.startRangeNode = null;
        this.endRangeNode = null;
        this.startContainer = null;
        this.startNode = null;
        this.endContainer = null;
        this.endNode = null;
        this.startOffset = null;
        this.endOffset = null;
        this.chkItalic = null;
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
            // this.chkItalicInNodes();
            
        }

    }

    execute(){
        
        this.init();
        console.log(`
/*----------------------------------------------------------*/
            this.cloneNodes.length: ${ this.cloneNodes.childNodes.length },
            this.startContainer: ${ this.startContainer },
            this.startOffset: ${ this.startOffset },
            this.endContainer: ${ this.endContainer },
            this.endOffset: ${ this.endOffset },
            this.chkMultiLineValue: ${ this.chkMultiLineValue },
/*----------------------------------------------------------*/
        `);
        
        
        // this.removeRange();
        console.log('this.startContainer: ', this.startContainer );
        console.log('this.startOffset: ', this.startOffset );
        console.log('this.endContainer: ', this.endContainer );
        console.log('this.endOffset: ', this.endOffset );
        console.log('this.selection: ', this.selection );
        styleTextNodesInRange( this.range );
        this.selection.removeAllRanges();
        this.selection.addRange( this.originalRange );
        // this.removeRange();

        // let revCloneNodes = Array.from( this.cloneNodes.cloneNode(true).childNodes ).reverse();
        // console.log('revCloneNodes: ', revCloneNodes );

        // revCloneNodes.forEach( node => {
            
        //     while( node.firstChild ) {
        //         let div = document.createElement('div');
        //         let i = document.createElement('i');
        //         i.appendChild( node.firstChild );
        //         div.appendChild( i );
        //         this.range.insertNode( div );
        //     }
            
        // });

        // console.log('cloneNodes: ', this.cloneNodes );

        
        
        // ( this.chkItalic ) ? this.removeItalic() : this.setItalic;

    }

    setItalic() {
        // 싱글라인 적용
        if( this.chkMultiLineValue ) this.setMultiItalic();
            

    }

    setMultiItalic() {
        // 멀티라인 적용

    }

    removeItalic() {

        if( this.chkMultiLineValue ) this.removeMultiItalic();
        // 싱글라인 제거

    }

    removeMultiItalic() {
        // 멀티라인 제거

    }

    // <i>태그 판별:하위,자식 포함
    chkItalicInNodes() {
        
        ( chkFuncItalic() ) ? this.chkItalic = true : this.chkItalic = false;

    }

    // 멀티라인, 싱글라인 체크
    chkMultiLine() {

        let selectedText = this.selection.toString();

        if( this.cloneNodes ) {
            this.chkMultiLineValue = ( selectedText.split('\n').length > 1 ) ? true : false;
        }

    }

    getStartContainer() {

        if( this.startContainer ) return this.startContainer;
    
    }

    getEndContainer() {

        if( this.endContainer ) return this.endContainer;

    }

    getStartOffset() {

        if( this.startOffset ) return this.startOffset;
    
    }

    getEndOffset() {

        if( this.endOffset ) return this.endOffset;

    }

    resetRange() {
        
        this.range = document.createRange();
    }

    getRange() {
        if( this.range ) return this.range;
    }

    clone() {

        if ( this.range ) this.cloneNodes = this.range.cloneContents();
    
    }

    extract() {

        if( this.range ) {
            
            this.extractNodes = this.range.extractContents();
            return this.extractNodes;
        
        }

    }

    removeRange() {

        if( this.range ) {
            this.range.deleteContents();
        }

    }

    insert( node ) {

        if( this.range ) {
            this.range.insertNode( node )
            return this.range
        }
    }

    initRange() {

        if( this.selection ) this.selection.removeAllRanges();

    }

    addRange() {

        if( this.selection && this.range ) this.selection.addRange( this.range );

    }

    resetRange() {

        if ( this.range ) this.range = document.createRange() 
    
    }

    setStartRange( startNode ) {

        if( this.range ) this.range.setStartBefore( startNode );
        this.startRangeNode = startNode;
        return this.startRangeNode

    }

    setEndRange( endNode ) {

        if( this.range ) this.range.setEndAfter( endNode );
        this.endRangeNode = endNode;
        return this.endRangeNode

    }

    setRange() {

        if( this.startRangeNode && this.endRangeNode ) {

            if( this.selection && this.range ) {
                
                this.selection.removeAllRanges();
                this.selection.addRange( this.range )

            }
        
        }

    }

}

export default Text_Button_Italic