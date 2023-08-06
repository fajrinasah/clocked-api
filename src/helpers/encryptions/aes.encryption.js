import CryptoJS from "crypto-js";

import * as config from "../../configs/index.js";

/*-----------------------------------------------------*/
// ENCRYPT & DECRYPT
/*-----------------------------------------------------*/
const secretKey = config.ENCRYPTION_SECRET_KEY;

export function encrypt(plainText) {
  const cipherText = CryptoJS.AES.encrypt(plainText, secretKey).toString();
  return cipherText;
}

export function decrypt(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const plainText = bytes.toString(CryptoJS.enc.Utf8);
  return plainText;
}
