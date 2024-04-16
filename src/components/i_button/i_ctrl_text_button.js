class ITextButton {

    constructor() {

        this.selection = window.getSelection();
        this.range = ( this.selection ) ? this.selection.getRangeAt(0) : null;

    }

    init() {
        throw new Error('Must Include this method');
    }

    execute() {
        throw new Error('Must Include this method');
    }

    clone() {
        throw new Error('Must Include this method');
    }

    removeRange() {
        throw new Error('Must Include this method');
    }

}

export default ITextButton