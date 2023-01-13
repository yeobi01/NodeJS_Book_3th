const fs = require('fs');
const zlib = require('zlib');

// pipe로 readStream과 writeStream을 합쳐서 파일 복사하기
const readStream = fs.createReadStream('./readme3.txt', {highWaterMark: 16});
const writeStream = fs.createWriteStream('./writeme3.txt');
readStream.pipe(writeStream); // <- 이 코드는 주석처리 해야함

// zlibStream으로 압축해서 파일 복사하기
const zlibStream = fs.createWriteStream('./writeme4.txt.gz');
readStream.pipe(zlibStream).pipe(writeStream);