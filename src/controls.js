export default class Controls {
    static Keypad = { 
        w: false, 
        a: false, 
        s: false, 
        d: false, 
        space: false 
    }
    static initialise() {        
        function onDocumentKeyDown(event) {
            let keyCode = event.which;
        
            if (keyCode == 87) {
                Keypad.w = true;
            } else if (keyCode == 83) {
                Keypad.s = true;
            } else if (keyCode == 65) {
                Keypad.a = true;
            } else if (keyCode == 68) {
                Keypad.d = true;
            } else if (keyCode == 32) {
                Keypad.space = true;
            }
            return false;
        };
        
        
        function onDocumentKeyUp(event) {
            let keyCode = event.which;
        
            if (keyCode == 87) {
                Keypad.w = false;
            } else if (keyCode == 83) {
                Keypad.s = false;
            } else if (keyCode == 65) {
                Keypad.a = false;
            } else if (keyCode == 68) {
                Keypad.d = false;
            } else if (keyCode == 32) {
                Keypad.space = false;
            }
            return false;
        };
        
        document.addEventListener("keydown", onDocumentKeyDown, false);
        document.addEventListener("keyup", onDocumentKeyUp, false);
    }
}