var Node = require('./node');
var Relationship = require('./relationship');

class Network {
    constructor() {
        this.nodes = {};
    }
    add(name) {
        this.nodes[name] = new Node(name);
    }
    relate(nodeA, description, nodeB) {
        this.nodes[nodeA].relationships.push(new Relationship(this.nodes[nodeA].name, description, this.nodes[nodeB].name));
        this.nodes[nodeB].relationships.push(new Relationship(this.nodes[nodeA].name, description, this.nodes[nodeB].name));
    }
}

module.exports = Network;