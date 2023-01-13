import { Buffer } from "buffer";

import { CRYPTO_LENGTH } from "./config";

import cryp from "isomorphic-webcrypto";

export const importKey = async (keyToken) => {
  let newKey;

  newKey = await cryp.subtle.importKey(
    "jwk", //can be "jwk" or "raw"
    {
      //this is an example jwk key, "raw" would be an ArrayBuffer
      kty: "oct",
      k: keyToken,
      alg: `A${CRYPTO_LENGTH}GCM`,
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
      length: CRYPTO_LENGTH, //can be  128, 192, or 256
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
