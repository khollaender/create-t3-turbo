import CryptoJS from "crypto-js";

const keySize = 256;
const ivSize = 128;
const saltSize = 128;
const iterations = 100;
const seedSize = 128;

var message = "Hello World";
var password = "41435231323535552d4a312041757458";

const generateKey = (pass: string) => {
  var salt = CryptoJS.lib.WordArray.random(saltSize / 8);

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  return { value: key, salt: salt };
};

const generatePatientKey = () => {
  var salt = CryptoJS.lib.WordArray.random(saltSize / 8);
  var seed = CryptoJS.lib.WordArray.random(seedSize / 8);

  var key = CryptoJS.PBKDF2(seed, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  return { value: key, salt: salt };
};

CryptoJS.lib.WordArray.random(128 / 8);

const encryptWithKey = (msg: string, key) => {
  var iv = CryptoJS.lib.WordArray.random(ivSize / 8);

  var encrypted = CryptoJS.AES.encrypt(msg, key.value, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = iv.toString() + encrypted.toString();
  //   console.log(`${iv.toString()}_${encrypted.toString()}`);
  //   console.log(
  //     "encrypted.toString():",
  //     encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  //   );
  return transitmessage;
};

const decryptWithKey = (transitmessage: string, key) => {
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var encrypted = transitmessage.substring(32);

  var decrypted = CryptoJS.AES.decrypt(encrypted, key.value, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted;
};

const decryptBase64 = (transitmessage: string, key) => {
  const parts = transitmessage.split("_");

  //var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  var iv = CryptoJS.enc.Base64.parse(parts[0]);
  var encrypted = CryptoJS.enc.Base64.parse(parts[1]).toString(
    CryptoJS.enc.Hex
  );
  console.log("iv", iv, "Hex:", encrypted);
  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted;
};

const isValidValue = (value) => {
  if (!Array.isArray(value) && isObject(value)) {
    return Object.keys(value).length > 0;
  }
  return value;
};
function isObject(obj) {
  return obj === Object(obj);
}

function isString(value) {
  return typeof value === "string" || value instanceof String;
}

const encryptObjPropsWithKey = (data, keyCrypto) => {
  if (data === null) {
    throw "dataIsNull";
  }
  let encryptedData = {};

  Object.keys(data).map((key) => {
    const dataValue = data[key];
    if (key.toString().toLowerCase().includes("id")) {
      encryptedData[key] = dataValue;
    } else {
      let processValue = dataValue;

      if (!isString(dataValue)) {
        processValue = JSON.stringify(dataValue);
      }

      encryptedData[key] = encryptWithKey(processValue, keyCrypto);
    }
  });
  return encryptedData;
};

const decryptObjPropsWithKey = (data, keyCrypto) => {
  if (data === null) {
    throw "dataIsNull";
  }
  let decryptedData = {};

  Object.keys(data).map((key) => {
    const dataValue = data[key];
    if (key.toString().toLowerCase().includes("id")) {
      decryptedData[key] = dataValue;
    } else {
      decryptedData[key] = decryptWithKey(dataValue, keyCrypto).toString(
        CryptoJS.enc.Utf8
      );
    }
  });
  return decryptedData;
};

const encryptArrayWithKey = (list, key) => {
  const encryptedArray = list.map((item) => encryptObjPropsWithKey(item, key));
  return encryptedArray;
};

const decryptArrayWithKey = (list, key) => {
  const decryptedArray = list.map((item) => decryptObjPropsWithKey(item, key));
  return decryptedArray;
};

export {
  generateKey,
  encryptWithKey,
  decryptWithKey,
  decryptBase64,
  encryptObjPropsWithKey,
  decryptObjPropsWithKey,
  encryptArrayWithKey,
  decryptArrayWithKey,
  generatePatientKey,
};
