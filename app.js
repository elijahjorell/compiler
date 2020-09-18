var glob = require('glob');
var path = require('path');
var basePath = './entries';

const db = glob.sync(path.join(basePath, '**/exports.js')).reduce((db, filePath) => {
    var fileImport = require('./' + filePath);
    var fileName = path.basename(path.dirname(filePath));

    if (!db[fileName]) db[fileName] = {};

    Object.keys(fileImport).map((property) => {
        db[fileName][property] = fileImport[property];
    });

    return db;
}, {});

module.exports = db;