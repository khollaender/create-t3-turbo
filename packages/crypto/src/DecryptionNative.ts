import { Buffer } from "buffer";
import { z } from "zod";
import { ConvertToDecryptType, Encryptable } from "./EncryptionTypes";

import cryp from "isomorphic-webcrypto";

// cryp.subtle
//   .digest({ name: "SHA-256" }, new Uint8Array([1, 2, 3]).buffer)
//   .then((hash) => {
//     // hashes are usually represented as hex strings
//     // hex-lite makes this easier
//     const hashString = Buffer.from(hash).toString("hex");
//     console.log("hashString", hashString);
//   });

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
        const encrypted = await decryptNative(cryptoKey, value, valueType);
        return [`${keyName}_Dec`, encrypted];
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
  //console.log("iv", parts[0], iv);

  const encryptedBytes = base64ToUint8(parts[1]);

  let decryptedBytes;
  try {
    decryptedBytes = await cryp.subtle.decrypt(
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

const uint8ToBase64 = (arr: Uint8Array): string =>
  window.btoa(
    Array(arr.length)
      .fill("")
      .map((_, i) => String.fromCharCode(arr[i]))
      .join(""),
  );

const base64ToUint8 = (str: string): Uint8Array =>
  Uint8Array.from(atob(str), (c) => c.charCodeAt(0));
