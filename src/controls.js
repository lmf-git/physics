export default class Controls {
    static Keypad = { 
        w: false, 
        a: false, 
        s: false, 
        d: false, 
        space: false 
    }
    static initialise() {    
        const keyToggleHandler = state => ev => {
            if (ev.which == 87) this.Keypad.w = state;
            if (ev.which == 83) this.Keypad.s = state;
            if (ev.which == 65) this.Keypad.a = state;
            if (ev.which == 68) this.Keypad.d = state;
            if (ev.which == 32) this.Keypad.space = state;
            return false;
        } 
        
        document.addEventListener("keydown", keyToggleHandler(true), false);
        document.addEventListener("keyup",  keyToggleHandler(false), false);
    }
}