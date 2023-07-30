const fs = require('fs');

const writeFile = (fileName, data, option) => {
    if (option === 'Async') {
        return fs.writeFileSync(fileName, JSON.stringify(data));
    } else {
        return fs.writeFile(fileName, JSON.stringify(data), (err) => {
            if (err) console.log(err);
        });
    }
};

const readFile = (fileName, option) => {
    if (option === 'Async') {
        return fs.readFileSync(fileName, 'utf-8');
    } else {
        return fs.readFile(fileName, 'utf-8', (err) => {
            if (err) console.log(err);
        });
    }
};

const checkFileExist = (filePath) => {
    return fs.existsSync(filePath);
};

module.exports = {
    writeFile,
    readFile,
    checkFileExist,
};
