const fs = require('fs');

function DeleteFile(path) {
    return new Promise((resolve, reject) => {
        fs.unlink(path, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports = {
    DeleteFile
};