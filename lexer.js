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
        this.skipIdentifierUpdate = false;
        this.grammar = [
            { regEx: /[a-z]/i   , type: 'ALPHA'},
            { regEx: /}/        , type: 'CLOSED_CURLY_BRACKET'},
            { regEx: /:/        , type: 'COLON'},
            { regEx: /,/        , type: 'COMMA'},
            { regEx: />/        , type: 'GREATER_THAN'},
            { regEx: /-/        , type: 'HYPHEN'},
            { regEx: /\n/       , type: 'NEW_LINE'},
            { regEx: /{/        , type: 'OPEN_CURLY_BRACKET'},
            { regEx: /'/        , type: 'QUOTATION'},
            { regEx: /\r/       , type: 'RETURN'}, 
            { regEx: / /        , type: 'WHITE_SPACE'},
        ];
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
                this.tokenSetIdentifier(identifiedChar);
                this.tokenAddChar(char);
            } else {
                if (this.token.idf === 'ALPHA') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.nextCol();
                            break;
                        case 'CLOSED_CURLY_BRACKET':
                            this.tokenStore();
                            this.nextCol();
                            break;
                        case 'COMMA':
                            this.tokenStore();
                            this.nextCol();
                            break;                
                        case 'OPEN_CURLY_BRACKET':
                            this.tokenStore();
                            this.nextCol();
                            break;
                        case 'RETURN':
                            this.tokenStore();
                            this.nextLine();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.nextCol();
                            break;
                    }
                } else if (this.token.idf === 'CLOSED_CURLY_BRACKET') {
                    switch (identifiedChar) {
                        case 'RETURN':
                            this.tokenStore();
                            this.nextLine();
                            break;
                    }
                } else if (this.token.idf === 'COLON') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.tokenStore();
                            this.nextCol();
                            break;
                        case 'QUOTATION':
                            this.tokenStore();
                            this.nextCol();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.nextCol();
                            break;
                    }
                } else if (this.token.idf === 'COMMA') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.tokenStore();
                            this.nextCol();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.nextCol();
                            break;
                        case 'RETURN':
                            this.tokenStore();
                            this.nextLine();
                            break;
                    }
                } else if (this.token.idf === 'OPEN_CURLY_BRACKET') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.tokenStore();
                            this.nextCol();
                            break;            
                        case 'HYPHEN':
                            this.tokenStore();
                            this.nextCol();
                            break;
                        case 'RETURN':
                            this.tokenStore();
                            this.nextLine();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.nextCol();
                            break; 
                    }
                } else if (this.token.idf === 'HYPHEN') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.tokenStore();
                            this.nextCol();
                            break; 
                        case 'GREATER_THAN':
                            this.nextCol();
                            break;                 
                        case 'HYPHEN':
                            this.nextCol();
                            break;                        
                        case 'QUOTATION':
                            this.skipIdentifierUpdate = true;
                            this.token.idf = 'HYPHEN_QUOTATION';
                            this.nextCol();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.nextCol();
                            break;
                    }
                } else if (this.token.idf === 'HYPHEN_QUOTATION') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.skipIdentifierUpdate = true;
                            this.nextCol();
                            break;               
                        case 'QUOTATION':
                            this.skipIdentifierUpdate = true;
                            this.token.idf = 'HYPHEN_QUOTATION_QUOTATION';
                            this.nextCol();
                            break;
                        case 'WHITE_SPACE':
                            this.skipIdentifierUpdate = true;
                            this.nextCol();
                            break;
                    }
                } else if (this.token.idf === 'HYPHEN_QUOTATION_QUOTATION') {
                    switch (identifiedChar) {
                        case 'GREATER_THAN':
                            this.skipIdentifierUpdate = true;
                            this.token.idf = 'HYPHEN_QUOTATION_QUOTATION_COMPLETE';
                            this.nextCol();
                            break;                 
                        case 'HYPHEN':
                            this.skipIdentifierUpdate = true;
                            this.token.idf = 'HYPHEN_QUOTATION_QUOTATION_COMPLETE';
                            this.nextCol();
                            break;
                    }
                } else if (this.token.idf === 'HYPHEN_QUOTATION_QUOTATION_COMPLETE') {
                    switch (identifiedChar) {
                        case 'ALPHA':
                            this.tokenStore();
                            this.nextCol();
                            break;         
                        case 'RETURN':
                            this.tokenStore();
                            this.nextLine();
                            break;
                        case 'WHITE_SPACE':
                            this.tokenStore();
                            this.nextCol();
                            break; 
                    }
                }

                if (identifiedChar !== 'WHITE_SPACE' &&
                    identifiedChar !== 'NEW_LINE' &&
                    identifiedChar !== 'RETURN') {
                    if (this.skipIdentifierUpdate) {
                        this.skipIdentifierUpdate = false;
                    } else {
                        this.tokenSetIdentifier(identifiedChar);
                    }
                    this.tokenAddChar(char);
                }
            }
            console.log(this.token);
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
    tokenSetIdentifier(identifiedChar) {
        this.token.idf = identifiedChar;
        this.token.line = this.line;
        this.token.col = this.col;
    }
    tokenStore() {
        this.tokens.push(this.token);
        this.tokenReset();
    }
}

module.exports = Lexer;
