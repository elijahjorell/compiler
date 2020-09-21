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
            'HYPHEN_QUOTATION_QUOTATION',
            'HYPHEN_QUOTATION_QUOTATION_COMPLETE'
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
            var identifiedChar = this.identify(char);
            if (this.token.val === '' && 
                identifiedChar !== 'WHITE_SPACE' &&
                identifiedChar !== 'NEW_LINE' &&
                identifiedChar !== 'RETURN') {
                this.token.idf = identifiedChar;
                this.token.line = this.line;
                this.token.col = this.col;
                this.tokenAddChar(char);
            } else {
                if (this.token.idf === 'ALPHA') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.nextCol();
                            break;
                        case 'COMMA':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break;                
                        case 'OPEN_CURLY_BRACKET':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break;
                        case 'RETURN':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextLine();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break; 
                    }
                } else if (this.token.idf === 'OPEN_CURLY_BRACKET') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break;            
                        case 'HYPHEN':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break;
                        case 'RETURN':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextLine();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break; 
                    }
                } else if (this.token.idf === 'HYPHEN') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break; 
                        case 'GREATER_THAN':
                            this.nextCol();
                            break;                 
                        case 'HYPHEN':
                            this.nextCol();
                            break;                        
                        case 'QUOTATION':
                            this.nextCol();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break;
                    }
                } else if (this.token.idf === 'HYPHEN_QUOTATION') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.nextCol();
                            break;               
                        case 'QUOTATION':
                            this.token.idf = 'HYPHEN_QUOTATION_QUOTATION';
                            this.nextCol();
                            break;
                        case 'WHITE_SPACE':
                            this.nextCol();
                            break;
                    }
                } else if (this.token.idf === 'HYPHEN_QUOTATION_QUOTATION') {
                    switch (identifiedChar) {
                        case 'GREATER_THAN':
                            this.token.idf = 'HYPHEN_QUOTATION_QUOTATION_COMPLETE';
                            this.nextCol();
                            break;                 
                        case 'HYPHEN':
                            this.token.idf = 'HYPHEN_QUOTATION_QUOTATION_COMPLETE';
                            this.nextCol();
                            break;
                    }
                } else if (this.token.idf === 'HYPHEN_QUOTATION_QUOTATION_COMPLETE') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break;         
                        case 'RETURN':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextLine();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.tokenReset();
                            this.nextCol();
                            break; 
                    }
                }

                if (identifiedChar !== 'WHITE_SPACE' &&
                    identifiedChar !== 'NEW_LINE' &&
                    identifiedChar !== 'RETURN') {
                    this.token.idf = identifiedChar;
                    this.tokenAddChar(char);
                }
            }
            console.log(this.token.idf, this.token.val);
        });
        return this;
    }
    nextCol() {
        this.col++;
    }
    nextLine() {
        this.col = 1;
        this.line++;
    }
    tokenAddChar(char) {
        this.token.val += char;
    }
    tokenReset() {
        this.token.idf = undefined;
        this.token.line = undefined;
        this.token.col = undefined;
        this.token.val = '';
    }
    tokenStore() {
        this.tokens.push(this.token);
    }
}

module.exports = Lexer;
