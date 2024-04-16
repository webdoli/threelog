class Controller_mogl {
    constructor() {

        this.ctrl = null;
    
    }

    execute() {
        if( this.ctrl )  this.ctrl.execute();
    }

    setCtrl( ctrl ) {
    
        this.ctrl = ctrl; 
    
    }

    getCtrl() {

        if( this.ctrl ) return this.ctrl
    
    }
}

export default Controller_mogl