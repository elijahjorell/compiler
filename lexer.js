const { timingSafeEqual } = require("crypto");

class Lexer {
    constructor() {
        this.token = {
            idf: undefined,
            line: 1,
            col: 1,
            val: ''
        };
        this.tokens = [];
        this.line = 1; 
        this.col = 1;
        this.grammar = [
            { regEx: /[a-z]/i   , type: 'ALPHA'},
            { regEx: /}/        , type: 'CLOSED_CURLY_BRACKET'},
            { regEx: /,/        , type: 'COMMA'},
            { regEx: />/        , type: 'GREATER_THAN'},
            { regEx: /-/        , type: 'HYPHEN'},
            { regEx: /\n/       , type: 'NEW_LINE'},
            { regEx: /{/        , type: 'OPEN_CURLY_BRACKET'},
            { regEx: /'/        , type: 'QUOTATION'},
            { regEx: /\r/       , type: 'RETURN'}, 
            { regEx: / /        , type: 'WHITE_SPACE'},
        ];
        this.identifiers = [
            'ALPHA',
            'OPEN_CURLY_BRACKET',
            'HYPHEN',
            'HYPHEN_QUOTATION',
            'HYPHEN_QUOTATION_QUOTATION'
        ]
    }
    identify(char) {
        for (var i = this.grammar.length - 1; i >= 0; i--) {
            if (char.match(this.grammar[i].regEx)) {
                return this.grammar[i].type;
            }
        }
    }
    lex(program) {
        program.split('').map((char) => {
            if (this.token.val === '' && 
                this.identify(char) !== 'WHITE_SPACE' &&
                this.identify(char) !== 'NEW_LINE' &&
                this.identify(char) !== 'RETURN') {
                this.token.idf = this.identify(char);
                this.token.val += char;
            } else {
                if (this.token.idf === 'ALPHA') {
                    switch (this.identify(char)) {
                        case 'ALPHA':
                            break;
                        case 'COMMA':
                            break;                
                        case 'OPEN_CURLY_BRACKET':
                            break;
                        case 'RETURN':
                            break;
                        case 'WHITE_SPACE':
                            break; 
                    }
                } else if (this.token.idf === 'OPEN_CURLY_BRACKET') {
                    switch (this.identify(char)) {
                        case 'ALPHA':
                            break;            
                        case 'OPEN_CURLY_BRACKET':
                            break;
                        case 'RETURN':
                            break;
                        case 'WHITE_SPACE':
                            break; 
                    }
                } else if (this.token.idf === 'HYPHEN') {
                    switch (this.identify(char)) {
                        case 'ALPHA':
                            break; 
                        case 'GREATER_THAN':
                            break;                 
                        case 'HYPHEN':
                            break;                        
                        case 'QUOTATION':
                            break;
                        case 'WHITE_SPACE':
                            break;
                    }
                } else if (this.token.idf === 'HYPHEN_QUOTATION') {
                    switch (this.identify(char)) {
                        case 'ALPHA':
                            break;               
                        case 'QUOTATION':
                            break;
                        case 'WHITE_SPACE':
                            break;
                    }
                } else if (this.token.idf === 'HYPHEN_QUOTATION_QUOTATION') {
                    switch (this.identify(char)) {
                        case 'GREATER_THAN':
                            break;                 
                        case 'HYPHEN':
                            break;
                    }
                }
            }
        });
        return this;
    }
}

module.exports = Lexer;
