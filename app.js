const database = {

};

const test_string = `
    ELIJAH_ESMERO -loves> VANESSA_WILLIAMS;

    VANESSA_WILLIAMS -loves> ELIJAH_ESMERO;

    ELIJAH_ESMERO {
        -- UNSW;
        -dislikes> SALT_AND_VINEGAR_CHIPS;
    }

    ELIJAH_ESMERO {
        - has 2 feet, legs, arms, ears and eyes;
        - has black hair;
    }
`;

// console.log(
//     test_string
//         .split('\n')
//         .filter((line) => line != '')
//         .map((line) => line.trim())
// );

// scan for {} first

var glob = require('glob');
var path = require('path');
var basePath = './test_require';

var db = glob.sync(path.join(basePath, '*.js')).reduce((db, filePath) => {
    var fileImport = require('./' + filePath);
    var fileName = path.basename(filePath, '.js');

    if (!db[fileName]) db[fileName] = {};

    Object.keys(fileImport).map((property) => {
        db[fileName][property] = fileImport[property];
    });

    return db;
}, {});

console.log(db)

// fs.readdir('./test_require', (err, files) => {
//     if (err) throw err;
//     files.forEach((file) => {
//         require('./test_require/' + file)
//     });
// });

