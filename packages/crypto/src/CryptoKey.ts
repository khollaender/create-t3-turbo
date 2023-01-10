import { Buffer } from "buffer";
import { z } from "zod";
import {
  ConvertToDecryptType,
  ConvertToEncryptType,
  Encryptable,
} from "./EncryptionTypes";

import cryp from "isomorphic-webcrypto";

cryp.subtle
  .digest({ name: "SHA-256" }, new Uint8Array([1, 2, 3]).buffer)
  .then((hash) => {
    // hashes are usually represented as hex strings
    // hex-lite makes this easier
    const hashString = Buffer.from(hash).toString("hex");
    console.log("hashString", hashString);
  });

export const importKey = async (keyToken) => {
  let newKey;

  newKey = await cryp.subtle.importKey(
    "jwk", //can be "jwk" or "raw"
    {
      //this is an example jwk key, "raw" would be an ArrayBuffer
      kty: "oct",
      k: keyToken,
      alg: "A128GCM",
      ext: true,
    },
    {
      //this is the algorithm options
      name: "AES-GCM",
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"], //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );

  return newKey;
};

export const generateKey = async () => {
  let newKey;

  newKey = await cryp.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 128, //can be  128, 192, or 256
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"], //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  );

  return newKey;
};

export const exportKey = async (cryptoKey) => {
  let newKey;

  newKey = await cryp.subtle.exportKey(
    "jwk", //can be "jwk" or "raw"
    cryptoKey, //extractable must be true
  );

  return newKey;
};
