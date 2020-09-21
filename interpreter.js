// ref material: http://craftinginterpreters.com/scanning-on-demand.html

const fs = require('fs');

var program = fs.readFileSync('./program.txt', 'utf-8');

const grammar = {
    alpha: /_|[a-z]/i
}

program.split('').reduce((scanner, char) => {
    if (!char.match(/\r|\n/)) {
        if (scanner.token.identifier === '' && char !== ' ') {
            scanner.token.identifier += char;
            scanner.token.val += char;
        } else {
            // Grammar
            if (scanner.token.identifier.match(grammar.alpha)) {
                if (char.match(grammar.alpha)) {
                    scanner.token.val += char;
                } else if (char === '{' || char === ' ' || char === '-') {
                    scanner.token.val = '';
                    scanner.token.identifier = '';
                    if (char !== ' ') {
                        scanner.token.val += char;
                    }
                } else {
                    // return console.log('error', scanner.line, scanner.col);
                }
            } else if (scanner.token.identifier === '{') {
                if (char.match(grammar.alpha) || char === '-') {
                    scanner.token.val = '';
                    scanner.token.identifier = '';
                    if (char !== ' ') {
                        scanner.token.val += char;
                    }
                } else {
                    
                }
            }
        }


        console.log(scanner.token.val)
        scanner.col++;
    } else if (char.match(/\r/)) {
        
        scanner.line++;
        scanner.col = 1;
    }
    
    return scanner;
}, { token: { identifier: '', val: '', line: 1, col: 1 }, tokens: [], line: 1, col: 1 });

/*

NEW_LINE - '\n'
WHITE_SPACE - ' '
NAME - alphanumerical all lowercase or _ (but cannot start or end with _)
OPEN_BRACE - {
CLOSED_BRACE - }
DIRECTED_RELATIONSHIP - '-any alphabetical text>'
UNDIRECTED_RELATIONSHIP - '-any alphabetical text-'
COMMA - ',' 
ATTRIBUTE - '- NAME'
ASSIGNMENT - 'ATTRIBUTE:'

*/

// get identifier
// scan until separator {} , \n

