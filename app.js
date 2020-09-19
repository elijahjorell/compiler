var Network = require('./classes/network');
var fs = require('fs');

// const science = new Network();

// science.add('physics');
// science.add('chemistry');

// science.relate('physics', 'is better than', 'chemistry')

// console.log(science.nodes.chemistry)

var input = fs.readFileSync('./compiler-input.txt', 'utf-8');

console.log(input
    .split('\r')
    .map((line) => line.trim())
    .filter((line) => line != '')
    .reduce((data, line, row) => {
        line.split('').map((char, col) => {
            if (char === '{' || char === '}') {
                data.brackets.push({ type: char, row: row, col: col });
            }
        });
        data.chunks.push(line);
        return data
    }, { chunks: [], brackets: [] })
)