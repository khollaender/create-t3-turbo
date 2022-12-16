import CryptoJS from "crypto-js";

var keySize = 256;
var ivSize = 128;
var iterations = 100;

var message = "Hello World";
var password = "41435231323535552d4a312041757458";

function encrypt(msg, pass) {
  var salt = CryptoJS.lib.WordArray.random(128 / 8);

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  var iv = CryptoJS.lib.WordArray.random(128 / 8);

  var encrypted = CryptoJS.AES.encrypt(msg, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
  //   console.log(`${iv.toString()}_${encrypted.toString()}`);
  //   console.log(
  //     "encrypted.toString():",
  //     encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  //   );
  return transitmessage;
}

function decrypt(transitmessage, pass) {
  var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  var encrypted = transitmessage.substring(64);

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted;
}

const decryptBase64 = (transitmessage, key) => {
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

const generateKey = (pas) => {
  var salt = CryptoJS.lib.WordArray.random(128 / 8);

  var key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  return { value: key, salt: salt };
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

const encryptObjProps = (data, pass) => {
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

      encryptedData[key] = encrypt(processValue, pass ? pass : password);
    }
  });
  return encryptedData;
};

const decryptObjProps = (data, pass) => {
  if (data === null) {
    throw "dataIsNull";
  }
  let decryptedData = {};

  Object.keys(data).map((key) => {
    const dataValue = data[key];
    if (key.toString().toLowerCase().includes("id")) {
      decryptedData[key] = dataValue;
    } else {
      decryptedData[key] = decrypt(dataValue, pass ? pass : password).toString(
        CryptoJS.enc.Utf8
      );
    }
  });
  return decryptedData;
};

const encryptArray = (list, pass) => {
  const encryptedArray = list.map((item) => encryptObjProps(item, pass));
  return encryptedArray;
};

export {
  encrypt,
  decrypt,
  decryptBase64,
  encryptObjProps,
  decryptObjProps,
  encryptArray,
};
