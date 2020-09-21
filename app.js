const fs = require('fs');

var raw = fs.readFileSync('./compiler-input-2.txt', 'utf-8');

console.log(raw);