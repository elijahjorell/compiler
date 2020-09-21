// ref material: http://craftinginterpreters.com/scanning-on-demand.html

const fs = require('fs');

var program = fs.readFileSync('./program.txt', 'utf-8');

program.split('').reduce((scanner, char) => {
    if (char.match(/\r/)) {
        scanner.col = 1;
        scanner.line++;
        scanner.token.val = '';
    } else if (!char.match(/\n|\r/)) {
        if (char.match(/[a-z]|_/)) {
            scanner.token.val += char;
        } else {
            if (scanner.token.val !== '') {
                console.log(scanner.token.val, scanner.line, scanner.col);
                scanner.token.val = '';
            }
            
            if (char === '{') {
                console.log(char, scanner.line, scanner.col);
            } else if (char ==='}') {
                console.log(char, scanner.line, scanner.col);
            } else if (char === ',') {
                console.log(char, scanner.line, scanner.col);
            }
        }
        scanner.col++;
    }
    return scanner;
}, { token: { val: ``, line: 1, col: 1 }, tokens: [], line: 1, col: 1 });

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

