import { Buffer } from "buffer";
import { z } from "zod";
import { ConvertToEncryptType, Encryptable } from "./EncryptionTypes";
import { CRYPTO_LENGTH, SPLIT_CHARACTER } from "./config";

import cryp from "isomorphic-webcrypto";

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
        !key.includes(SPLIT_CHARACTER) ||
        (typeof value !== "string" &&
          typeof value !== "number" &&
          typeof value !== "boolean")
      ) {
        return [key, value];
      } else {
        const encrypted = await encryptNative(cryptoKey, value);

        return [`${key.split(SPLIT_CHARACTER)[0]}_${typeof value}`, encrypted];
      }
    }),
  );
};

export const encryptNative = async (
  key: CryptoKey,
  data: Encryptable | null,
) => {
  if (!data) return null;

  const iv = cryp.getRandomValues(new Uint8Array(12));

  let encryptedBytes;

  let dataArray: Uint8Array;

  switch (typeof data) {
    case "string":
      dataArray = Buffer.from(data);
      break;
    case "number":
      dataArray = Uint8Array.of(data);
      break;
    case "object":
      dataArray = Buffer.from(JSON.stringify(data));
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
          tagLength: CRYPTO_LENGTH,
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
