const UniversalLexer = require('universal-lexer/browser');
const fs = require('fs');
var input = fs.readFileSync('./compiler-input-2.txt', 'utf-8');

const colon = {
    type: 'Colon',
    value: '{'
};

definitions = [colon]

const tokenise = UniversalLexer.compile(definitions);

const tokens = tokenise(input).tokens;

console.log(tokens);