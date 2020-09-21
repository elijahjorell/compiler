const fs = require('fs');
const Lexer = require('./lexer');
const program = fs.readFileSync('./program.txt', 'utf-8');

const lexer = new Lexer();

lexer.lex(program);

