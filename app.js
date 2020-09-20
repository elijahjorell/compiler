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
            if (char === '{') {
                data.openBrackets.unshift({ row: row, col: col });  
            } else if (char === '}') {
                data.chunk.start = data.openBrackets.shift();
                data.chunk.end = { row: row, col: col };
                data.chunks.push(data.chunk)
            }
        });

        return data;
    }, { openBrackets: [], chunk: { start: undefined, end: undefined }, chunks: [] }).chunks
);

/*
    check for {}, 
        if none, process as single line, 
        if yes, check for }, 
            if none, process as multi line
            if yes, process as tiered single line 


    
*/