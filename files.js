var fs = require('fs');

fs.appendFile('newfile.txt', 'Hello, World!', (err) => {
    if (err) throw err;
    console.log('Saved!');
});

fs.readdir('./', (err, files) => {
    files.forEach(file => {
        console.log(file);
    });
});