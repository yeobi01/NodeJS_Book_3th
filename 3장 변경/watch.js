const fs = require('fs').promises;

fs.watch('./target.txt')
    .then((eventType, filename) => {
        console.log(eventType, filename);
    });