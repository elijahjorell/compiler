var Network = require('./classes/network');

const science = new Network();

science.add('physics');
science.add('chemistry');

science.relate('physics', 'is better than', 'chemistry')

console.log(science.nodes.chemistry)