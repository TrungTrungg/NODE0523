const CryptoJS = require('crypto-js');

function encrypt(text) {
    const ciphertext = CryptoJS.AES.encrypt(text, secretKey).toString();
    return ciphertext;
}

function decrypt(ciphertext) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const plaintext = bytes.toString(CryptoJS.enc.Utf8);
    return plaintext;
}

module.exports = {
    encrypt,
    decrypt,
};
