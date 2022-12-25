const CryptoJS = require('crypto-js');

function sha2(string) {
    return CryptoJS.SHA256(string).toString();
}

function keccak(string) {
    return CryptoJS.SHA3(string).toString();
}

function aesEncrypt(data, key) {
  return CryptoJS.AES.encrypt(data, key).toString();
}

function aesDecrypt(data, key) {
    let bytes = CryptoJS.AES.decrypt(data, key);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = { 
    sha2,
    keccak,
    aesEncrypt,
    aesDecrypt,
}