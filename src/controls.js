export default class Controls {
    static Keypad = { 
        w: false, 
        a: false, 
        s: false, 
        d: false, 
        space: false 
    }
    static initialise() {        
        const onDocumentKeyDown = (event) => {
            let keyCode = event.which;
        
            if (keyCode == 87) {
                this.Keypad.w = true;
            } else if (keyCode == 83) {
                this.Keypad.s = true;
            } else if (keyCode == 65) {
                this.Keypad.a = true;
            } else if (keyCode == 68) {
                this.Keypad.d = true;
            } else if (keyCode == 32) {
                this.Keypad.space = true;
            }
            return false;
        };
        
        
        const onDocumentKeyUp = (event) => {
            let keyCode = event.which;
        
            if (keyCode == 87) {
                this.Keypad.w = false;
            } else if (keyCode == 83) {
                this.Keypad.s = false;
            } else if (keyCode == 65) {
                this.Keypad.a = false;
            } else if (keyCode == 68) {
                this.Keypad.d = false;
            } else if (keyCode == 32) {
                this.Keypad.space = false;
            }
            return false;
        };
        
        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener("keyup", onDocumentKeyUp, false);
    }
}