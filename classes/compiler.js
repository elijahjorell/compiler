class Compiler {
    constructor() {
        this.stack = [];
    }
    clean(raw) {
        return raw 
            .split('\r')
            .map((line) => line.replace(/\n/g, ''));
    }
    compile(cleaned) {
        
        // expect
    }
}

module.exports = Compiler;