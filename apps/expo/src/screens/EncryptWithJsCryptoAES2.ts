/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { data1k, data10k } from "./data";

import * as JsCrypto from "jscrypto/es6";

import CryptoJS from "crypto-js";

const keySize = 256;
const ivSize = 128;
const saltSize = 128;
const iterations = 100;
const seedSize = 128;

const generateKey = (pass: string) => {
  const salt = CryptoJS.lib.WordArray.random(saltSize / 8);

  const key = CryptoJS.PBKDF2(pass, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  return { value: key, salt: salt };
};

const generatePatientKey = () => {
  const salt = JsCrypto.Word32Array.random(saltSize / 8);
  const seed = CryptoJS.lib.WordArray.random(seedSize / 8);

  const key = CryptoJS.PBKDF2(seed, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });
  return { value: key, salt: salt };
};

CryptoJS.lib.WordArray.random(128 / 8);

const encryptWithKey = (msg: string, key: any) => {
  const iv = CryptoJS.lib.WordArray.random(ivSize / 8);

  const encrypted = CryptoJS.AES.encrypt(msg, key.value, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });

  // salt, iv will be hex 32 in length
  // append them to the ciphertext for use  in decryption
  const transitmessage = iv.toString() + encrypted.toString();
  //   console.log(`${iv.toString()}_${encrypted.toString()}`);
  //   console.log(
  //     "encrypted.toString():",
  //     encrypted.ciphertext.toString(CryptoJS.enc.Base64)
  //   );
  return transitmessage;
};

const decryptWithKey = (transitmessage: string, key: any) => {
  const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
  const encrypted = transitmessage.substring(32);

  const decrypted = CryptoJS.AES.decrypt(encrypted, key.value, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted;
};

const decryptBase64 = (transitmessage: string, key: any) => {
  const parts = transitmessage.split("_");

  //const iv = CryptoJS.enc.Hex.parse(transitmessage.substr(32, 32));
  const iv = CryptoJS.enc.Base64.parse(parts[0]);
  const encrypted = CryptoJS.enc.Base64.parse(parts[1]).toString(
    CryptoJS.enc.Hex
  );
  console.log("iv", iv, "Hex:", encrypted);
  const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return decrypted;
};

function isString(value: any) {
  return typeof value === "string" || value instanceof String;
}

const encryptObjPropsWithKey = (data: object, keyCrypto: any) => {
  interface encryptedObjectType {
    // 👇️ key         value
    [key: string]: string;
  }

  const encryptedData: encryptedObjectType = {};

  Object.keys(data).map((key) => {
    const dataValue = data[key as keyof typeof data];
    if (key.toString().toLowerCase().includes("id")) {
      encryptedData[key as keyof typeof data] = dataValue;
    } else {
      let processValue: string | object = dataValue;

      if (!isString(dataValue)) {
        processValue = JSON.stringify(dataValue);
      }

      encryptedData[key as keyof typeof data] = encryptWithKey(
        processValue,
        keyCrypto
      );
    }
  });
  return encryptedData;
};

const decryptObjPropsWithKey = (data: object, keyCrypto: any) => {
  interface decryptedObjectType {
    // 👇️ key         value
    [key: string]: string;
  }
  let decryptedData: decryptedObjectType = {};

  Object.keys(data).map((key) => {
    const dataValue = data[key as keyof typeof data];
    if (key.toString().toLowerCase().includes("id")) {
      decryptedData[key as keyof typeof data] = dataValue;
    } else {
      decryptedData[key as keyof typeof data] = decryptWithKey(
        dataValue,
        keyCrypto
      ).toString(CryptoJS.enc.Utf8);
    }
  });
  return decryptedData;
};

const encryptArrayWithKey = (list: Array<object>, key: any) => {
  const encryptedArray = list.map((item) => encryptObjPropsWithKey(item, key));
  return encryptedArray;
};

const decryptArrayWithKey = (list: Array<object>, key: any) => {
  const decryptedArray = list.map((item) => decryptObjPropsWithKey(item, key));
  return decryptedArray;
};

const runTest = () => {
  const patientKey = generatePatientKey();
  console.log("patientKey:", patientKey.value.toString(CryptoJS.enc.Hex));

  //const key = generateKey("41435231323535552d4a312041757458");
  const key = patientKey;

  console.time("encrypting1000");
  const encArray1000 = encryptArrayWithKey(data1k, key);
  console.log("encArray1000[999]", encArray1000[999]);
  console.timeEnd("encrypting1000");

  console.time("decrypting1000");
  const decArray1000 = decryptArrayWithKey(encArray1000, key);
  console.log("decArray1000[999]", decArray1000[999]);
  console.timeEnd("decrypting1000");

  console.time("encrypting10000");
  const encArray10000 = encryptArrayWithKey(data10k, key);
  console.log("encArray10000[9999]", encArray10000[9999]);
  console.timeEnd("encrypting10000");

  console.time("decrypting10000");
  const decArray10000 = decryptArrayWithKey(encArray10000, key);
  console.log("decArray10000[9999]", decArray10000[9999]);
  console.timeEnd("decrypting10000");
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
  runTest,
};
