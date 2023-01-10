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

  newKey = await crypto.subtle.importKey(
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

export async function decryptAllPropsNative<T>(
  cryptoKey: CryptoKey,
  encryptedObj: T,
): Promise<ConvertToDecryptType<T>> {
  const result = z.record(z.unknown()).safeParse(encryptedObj);

  if (result.success) {
    return Object.fromEntries(await doDec(result.data, cryptoKey)) as never;
  }

  const resultArray = z.array(z.record(z.unknown())).safeParse(encryptedObj);

  if (resultArray.success) {
    const tet = await Promise.all(
      resultArray.data.map(async (x) => {
        console.log(Object.fromEntries(await doDec(x, cryptoKey)));
        return Object.fromEntries(await doDec(x, cryptoKey));
      }),
    );
    return tet as never;
  }

  return encryptedObj as never;
}

const doDec = async (data: Record<string, unknown>, cryptoKey: CryptoKey) => {
  return await Promise.all(
    Object.entries(data).map(async ([key, value]) => {
      if (!key.includes("_") || (value !== null && typeof value !== "string")) {
        return [key, value];
      } else {
        const [keyName, valueType] = key.split("_");
        const encrypted = await decrypt(cryptoKey, value, valueType);
        return [`${keyName}_Dec`, encrypted];
      }
    }),
  );
};

export async function encryptAllPropsNative<T>(
  cryptoKey: CryptoKey,
  decryptedObj: T,
): Promise<ConvertToEncryptType<T>> {
  const result = z.record(z.unknown()).safeParse(decryptedObj);

  if (result.success) {
    const tet = await doStuff(result.data, cryptoKey);
    return Object.fromEntries(tet) as never;
  }

  const resultArray = z.array(z.record(z.unknown())).safeParse(decryptedObj);
  if (resultArray.success) {
    const tet = await Promise.all(
      resultArray.data.map(async (x) =>
        Object.fromEntries(await doStuff(x, cryptoKey)),
      ),
    );
    return tet as never;
  }

  return decryptedObj as never;
}

const doStuff = async (data: Record<string, unknown>, cryptoKey: CryptoKey) => {
  return await Promise.all(
    Object.entries(data).map(async ([key, value]) => {
      if (
        key.includes("id") ||
        (typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean")
      ) {
        return [key, value];
      } else {
        const encrypted = await encrypt(cryptoKey, value);

        return [`${key.split("_")[0]}_${typeof value}`, encrypted];
      }
    }),
  );
};

export const decryptNative = async (
  key: CryptoKey,
  dataWithIV: string | null,
  valueType: string,
): Promise<Encryptable | null> => {
  if (!dataWithIV) return null;

  const parts = dataWithIV.split("_");
  const iv = base64ToUint8(parts[0]);
  console.log("iv", parts[0], iv);

  const encryptedBytes = base64ToUint8(parts[1]);

  let decryptedBytes;
  try {
    decryptedBytes = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
        tagLength: 128,
      },
      key,
      encryptedBytes,
    );
  } catch (e) {
    console.log("error", e);
  }
  if (!decryptedBytes) throw Error("invalid");

  const decryptedArray = new Uint8Array(decryptedBytes);
  const decryptedString = Buffer.from(decryptedBytes).toString("utf8");

  switch (valueType) {
    case "string":
      return decryptedString;
    case "number":
      return Buffer.from(decryptedBytes).readUIntBE(
        0,
        decryptedBytes.byteLength,
      );
    case "object":
      return JSON.parse(decryptedString);
    case "boolean":
      return false;
    // dataArray = Uint8Array.of(data);
  }

  console.log(decryptedArray);

  return decryptedString;
};

export const encryptNative = async (
  key: CryptoKey,
  data: Encryptable | null,
) => {
  if (!data) return null;

  const iv = crypto.getRandomValues(new Uint8Array(12));

  let encryptedBytes;

  let dataArray: Uint8Array;

  switch (typeof data) {
    case "string":
      dataArray = enc.encode(data);
      break;
    case "number":
      dataArray = Uint8Array.of(data);
      break;
    case "object":
      dataArray = enc.encode(JSON.stringify(data));
      break;
    case "boolean":
      dataArray = Uint8Array.of(0); //todo fix
      break;
  }

  try {
    encryptedBytes = await crypto.subtle
      .encrypt(
        {
          name: "AES-GCM",
          iv: iv,
          tagLength: 128,
        },
        key,
        dataArray,
      )
      .catch(function (err) {
        console.error(err);
      });
  } catch (e) {
    console.log("error", e);
  }

  if (!encryptedBytes) return "";
  const base64Encrypted = uint8ToBase64(new Uint8Array(encryptedBytes));

  const base64IV = uint8ToBase64(new Uint8Array(iv));

  const result = `${base64IV}_${base64Encrypted}`;
  return result;
};

const uint8ToBase64 = (arr: Uint8Array): string =>
  window.btoa(
    Array(arr.length)
      .fill("")
      .map((_, i) => String.fromCharCode(arr[i]))
      .join(""),
  );

const base64ToUint8 = (str: string): Uint8Array =>
  Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

// export const getPasswordKey = (password: string) =>
//   crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
//     'deriveKey',
//   ]);

// const deriveKey = (
//   passwordKey: CryptoKey,
//   salt: Uint8Array,
//   keyUsage: KeyUsage[]
// ) =>
//   crypto.subtle.deriveKey(
//     {
//       name: 'PBKDF2',
//       salt: salt,
//       iterations: 250000,
//       hash: 'SHA-256',
//     },
//     passwordKey,
//     { name: 'AES-GCM', length: 256 },
//     false,
//     keyUsage
//   );

/*
 * This makes use of a few more complex typescript features
 * If anything in this file is confusing, work through this tutorial
 * https://www.totaltypescript.com/tutorials/beginners-typescript
 */
