const fs = require('fs');
const Compiler = require('./classes/compiler');

var compiler = new Compiler();

var raw = fs.readFileSync('./compiler-input-2.txt', 'utf-8');

var cleaned = compiler.clean(raw);

console.log(cleaned);