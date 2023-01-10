import React from "react";
import CryptoJS from "crypto-js";
import { btoa, atob } from "react-native-quick-base64";
import "react-native-console-time-polyfill";

import { Buffer } from "buffer";

import {
  encryptNative,
  decryptNative,
  importKey,
  decryptAllPropsNative,
  encryptAllPropsNative,
} from "crypto";

import {
  generateKey,
  generatePatientKey,
  encryptWithKey,
  decryptWithKey,
  decryptBase64,
  encryptObjPropsWithKey,
  encryptArrayWithKey,
  decryptArrayWithKey,
  // runTest,
  //} from "./EncryptWithAESCrypto";
  //} from "./EncryptWithJsCryptoAES2";
  //} from "./EncryptWithCryptoJS";
} from "./EncryptWithQuickCrypto";

import {
  runTest,
  //} from "./EncryptWithAESCrypto";
  //} from "./EncryptWithJsCryptoAES2";
} from "./EncryptWithCryptoJS";
//} from "./EncryptWithQuickCrypto";

import { data, data1k, data10k } from "./data";

// import crypto from "crypto";
// const abc = crypto.createHash("sha1").update("abc").digest("hex");
// console.log("abc:", abc);

// import crypto from "crypto";
// var abc = crypto.createHash("sha1").update("abc").digest("hex");
// console.log(abc);

// import CryptoES from "crypto-es";
// const rst = CryptoES.MD5("Message").toString();

// console.log("rst", rst);

// import AesGcmCrypto from "react-native-aes-gcm-crypto";

// const key2 = "Yzg1MDhmNDYzZjRlMWExOGJkNTk5MmVmNzFkOGQyNzk=";

// AesGcmCrypto.decrypt(
//   "LzpSalRKfL47H5rUhqvA",
//   key2,
//   "131348c0987c7eece60fc0bc",
//   "5baa85ff3e7eda3204744ec74b71d523",
//   false
// ).then((decryptedData) => {
//   console.log(decryptedData);
// });

// AesGcmCrypto.encrypt('{"name":"Hoge"}', false, key).then((result) => {
//   console.log(result);
// });

// import { QuickCrypto as crypto } from "react-native-quick-crypto";

// const plaintext =
//   "32|RmVZZkFUVmpRRkp0TmJaUm56ZU9qcnJkaXNNWVNpTTU*|iXmckfRWZBGWWELw" +
//   "eCBsThSsfUHLeRe0KCsK8ooHgxie0zOINpXxfZi/oNG7uq9JWFVCk70gfzQH8ZUJ" +
//   "jAfaFg**";

// const key = "0123456789abcdef";
// const cipher = crypto.createCipher("aes256", key);

// // Encrypt plaintext which is in utf8 format to a ciphertext which will be in
// // Base64.
// let ciph = cipher.update(plaintext, "utf8", "base64");
// ciph += cipher.final("base64");

// const decipher = crypto.createDecipher("aes256", key);
// let txt = decipher.update(ciph, "base64", "utf8");
// txt += decipher.final("utf8");
// console.log("plaintext", plaintext);

import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "@acme/api";

//import { trpc } from "../utils/trpc";

// import Crypto from "react-native-quick-crypto";

// const key = "39c1712d006939069338ec8dad160e0e";
// const plaintext = "150.01";
// const iv = new Buffer(Crypto.randomBytes(8));
// //const ivstring = iv.toString("hex");

// const ivstring = "134d75c8a1c5e61e60ea02f6";

// const cipher = Crypto.createCipheriv("aes-256-gcm", key, ivstring);
// const decipher = Crypto.createDecipheriv("aes-256-gcm", key, ivstring);

// cipher.update(plaintext, "utf8", "base64");
// const encryptedPassword = cipher.final("base64");

// console.log("iv", ivstring);

// console.log("encryptedPassword", encryptedPassword);

// const funcEnc = encryptWithKey(plaintext, key);

// console.log("funcEnc", funcEnc);

// const funcDec = decryptWithKey("b916ad318a2a80d29a7a320a7045b78f812ce14b", key);
// console.log("funcDec", funcDec);

import crypto from "isomorphic-webcrypto";
import hex from "hex-lite";

crypto.subtle
  .digest({ name: "SHA-256" }, new Uint8Array([1, 2, 3]).buffer)
  .then((hash) => {
    // hashes are usually represented as hex strings
    // hex-lite makes this easier
    const hashString = hex.fromBuffer(hash);
    console.log("hashString", hashString);
  });

const base64ToUint8 = (str: string): Uint8Array =>
  Uint8Array.from(atob(str), (c) => c.charCodeAt(0));

// const decryptData2 = await decrypt2(
//   aesKey,
//   "0TwFgJcUhikOWput_WEYZTDzQ6c17VGqfiDigbtvUpek=",
//   "string",
// );

// const key = "233f8ce4ac6aa125927ccd98af5750d0";
// const iv = "2f3849399c60cb04b923bd33265b81c7";

// const plaintext = "test";
// const cipher = Crypto.createCipheriv("aes-256-gcm", key, iv);
// let ciph = cipher.update(plaintext, "utf8", "hex");

// console.log("ciph", ciph);

// ciph += cipher.final("hex");

// const decipher = Crypto.createDecipheriv("aes-256-gcm", key, iv);
// let txt = decipher.update(ciph, "hex", "utf8");
// txt += decipher.final("utf8");

// console.log("txt", txt);

// const testENc = encryptArrayWithKey([{ hola: "test" }], key);
// console.log("testENc", testENc);

// console.time("QuickEncrypting1000");

// const encArray1000 = encryptArrayWithKey(data1k, key);
// console.log("encArray1000[999]", encArray1000[999]);
// console.timeEnd("QuickEncrypting1000");

// console.time("Qdecrypting1000");
// const decArray1000 = decryptArrayWithKey(encArray1000, key);
// console.log("QdecArray1000[999]", decArray1000[999]);
// console.timeEnd("Qdecrypting1000");

// console.time("Qencrypting10000");
// const encArray10000 = encryptArrayWithKey(data10k, key);
// console.log("encArray10000[9999]", encArray10000[9999]);
// console.timeEnd("Qencrypting10000");

// console.time("Qdecrypting10000");
// const decArray10000 = decryptArrayWithKey(encArray10000, key);
// console.log("decArray10000[9999]", decArray10000[9999]);
// console.timeEnd("Qdecrypting10000");

// runTest();

const test = async () => {
  const aesKey = await importKey("zzlJ8cyW0e3KB45kFFjaKA");

  console.log("key new", aesKey);

  const decryptData2 = await decryptNative(
    aesKey,
    "0TwFgJcUhikOWput_WEYZTDzQ6c17VGqfiDigbtvUpek=",
    "string",
  );

  console.log("decryptData2", decryptData2);
};

const PostCard: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
}> = ({ post }) => {
  return (
    <View className="rounded-lg border-2 border-gray-500 p-4">
      <Text className="text-xl font-semibold text-[#cc66ff]">{post.title}</Text>
      <Text className="text-white">{post.content}</Text>
    </View>
  );
};

const RunCryptoTest: React.FC<{
  post: inferProcedureOutput<AppRouter["post"]["all"]>[number];
}> = ({ post }) => {
  console.log("testing ");
  test();
};

const CreatePost: React.FC = () => {
  //const utils = trpc.useContext();
  // const { mutate } = trpc.post.create.useMutation({
  //   async onSuccess() {
  //     await utils.post.all.invalidate();
  //   },
  // });

  const [title, setTitle] = React.useState(post?.title);
  const [content, setContent] = React.useState(post?.content);
  const [contentEncrypted, setContentEncrypted] = React.useState("");
  React.useEffect(() => {
    setContent(post?.content);
    setTitle(post?.title);
  }, [post]);

  const uint8ToBase64 = (text: Uint8Array): string =>
    btoa(JSON.stringify(text));

  function hex_to_ascii(str1) {
    const hex = str1.toString();
    let str = "";
    for (let n = 0; n < hex.length; n += 2) {
      str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
  }

  // const encrypt = (valueStringHex, keyStringHex) => {
  //   const CryptoJS = require("crypto-js");
  //   const value = CryptoJS.enc.Hex.parse(valueStringHex);
  //   const key = CryptoJS.enc.Hex.parse(keyStringHex);
  //   const ivvar = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
  //   const encryptedStringHex = CryptoJS.AES.encrypt(valueStringHex, key, {
  //     iv: ivvar,
  //     mode: CryptoJS.mode.CBC,
  //     padding: CryptoJS.pad.NoPadding,
  //   }).ciphertext.toString();
  //   return encryptedStringHex;
  // };

  // const decrypt = (valueStringHex, keyStringHex) => {
  //   const CryptoJS = require("crypto-js");
  //   const value = CryptoJS.enc.Hex.parse(valueStringHex);
  //   const key = CryptoJS.enc.Hex.parse(keyStringHex);
  //   const ivvar = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
  //   const decryptedStringHex = CryptoJS.AES.decrypt(
  //     { ciphertext: value },
  //     key,
  //     { iv: ivvar, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.NoPadding }
  //   );

  //   //console.log("decryptedStringHex:", decryptedStringHex);
  //   return decryptedStringHex.toString();
  // };

  const encryptText = () => {
    // console.log(
    //   "encTaco returns 79d8a373d47bb25df3c1956b04106b15 : ",
    //   encrypt(
    //     "5ff58680541c5a5903f4833dfaa4281f",
    //     "41435231323535552d4a312041757458"
    //   )
    // );

    // console.log(
    //   "decTaco returns 5ff58680541c5a5903f4833dfaa4281f: ",
    //   decrypt(
    //     "79d8a373d47bb25df3c1956b04106b15",
    //     "41435231323535552d4a312041757458"
    //   )
    // );

    // const encrypted2 = CryptoJS.AES.encrypt("TestBird", "test");

    // console.log(encrypted2.toString());
    // const decrypted = CryptoJS.AES.decrypt(encrypted2, "test").toString(
    //   CryptoJS.enc.Utf8
    // );

    // console.log(decrypted);

    // var wordsEn = CryptoJS.enc.Utf16.parse("test");
    // console.log(
    //   "CryptoJS.enc.Hex.stringify(wordsEn),",
    //   wordsEn,
    //   CryptoJS.enc.Utf16.stringify(wordsEn),
    //   CryptoJS.enc.Hex.stringify(wordsEn)
    // );

    // const decryptBase64Test = decryptBase64(
    //   "wskXayGBPQqZNWMQ_O2ydUOgIpk/kV17rT4q7+MNb07E=",
    //   "NyDle19PUzdbI93EtEx5eheNtmi504HgMueH3YCFq3A"
    // );

    // console.log(
    //   "decryptBase64Test test returns: ",
    //   decryptBase64Test,
    //   decryptBase64Test.toString(),
    //   decryptBase64Test.toString(CryptoJS.enc.Utf8)
    // );

    const extestObj = {
      _id: "633ecfa455c0564dad5294f3",
      firstName: "Alissa",
      lastName: "LastName",
      email: "alissaware@orbaxter.com",
      phone: "+1 (873) 463-2052",
      company: "STUCCO",
      gender: 1,
      about:
        "Qui ut quis ea pariatur. Velit ad quis commodo ad dolore exercitation occaecat in duis. Officia pariatur sunt adipisicing pariatur pariatur ullamco laborum consectetur incididunt elit commodo occaecat consequat. Excepteur minim Lorem cupidatat in ex ad aute non duis elit ad. Tempor minim ipsum reprehenderit do culpa id mollit et proident dolor cupidatat cupidatat magna. Incididunt consectetur aute nulla cupidatat qui eiusmod ullamco eu dolore. Aliquip irure ullamco ad minim ipsum elit nostrud fugiat.",
      address: "781 Fanchon Place, Fedora, New Mexico, 5292",
    };

    //runTest();

    // const encObj = encryptObjProps(
    //   extestObj,
    //   "41435231323535552d4a312041757458"
    // );
    // console.log("encObj", encObj);

    // const decObj = decryptObjProps(encObj, "41435231323535552d4a312041757458");
    // console.log("decObj : ", decObj);

    // console.log("encrypting array with items: ", data.length);
    // console.time("encrypting");

    // const encArray = encryptArray(data, "41435231323535552d4a312041757458");
    // //console.log("encArray", encArray[2]);
    // console.timeEnd("encrypting");

    // console.time("encrypting1000");

    // const encArray1000 = encryptArray(
    //   data1k,
    //   "41435231323535552d4a312041757458"
    // );
    // //console.log("encArray", encArray[2]);
    // console.timeEnd("encrypting1000");

    // const key = "Yzg1MDhmNDYzZjRlMWExOGJkNTk5MmVmNzFkOGQyNzk=";

    // AesGcmCrypto.decrypt(
    //   "LzpSalRKfL47H5rUhqvA",
    //   key,
    //   "131348c0987c7eece60fc0bc",
    //   "5baa85ff3e7eda3204744ec74b71d523",
    //   false
    // ).then((decryptedData) => {
    //   console.log(decryptedData);
    // });

    // AesGcmCrypto.encrypt('{"name":"Hoge"}', false, key).then((result) => {
    //   console.log(result);
    // });

    // const patientKey = generatePatientKey();
    // console.log("patientKey:", patientKey.value.toString(CryptoJS.enc.Hex));

    // //const key = generateKey("41435231323535552d4a312041757458");
    // const key = patientKey;

    // console.time("encrypting1000");
    // const encArray1000 = encryptArrayWithKey(data1k, key);
    // //console.log("encArray1000[999]", encArray1000[999]);
    // console.timeEnd("encrypting1000");

    // console.time("decrypting1000");
    // const decArray1000 = decryptArrayWithKey(encArray1000, key);
    // //console.log("decArray1000[999]", decArray1000[999]);
    // console.timeEnd("decrypting1000");

    // console.time("encrypting10000");
    // const encArray10000 = encryptArrayWithKey(data10k, key);
    // //console.log("encArray10000[9999]", encArray10000[9999]);
    // console.timeEnd("encrypting10000");

    // console.time("decrypting10000");
    // const decArray10000 = decryptArrayWithKey(encArray10000, key);
    // //console.log("decArray10000[9999]", decArray10000[9999]);
    // console.timeEnd("decrypting10000");

    // const decObj = decryptObjProps(encObj, "41435231323535552d4a312041757458");
    // console.log("decObj : ", decObj);

    // const encryptTest = encrypt("test", "41435231323535552d4a312041757458");
    // console.log("encTaco test", encryptTest, encryptTest.toString());

    // const dec = decrypt(encryptTest, "41435231323535552d4a312041757458");
    // console.log("decTaco test returns test: ", dec.toString(CryptoJS.enc.Utf8));

    // const encryptTest2 = encrypt(
    //   JSON.stringify([1, 3, 4]),
    //   "41435231323535552d4a312041757458"
    // );
    // console.log("encTaco test2 array ", encryptTest2);

    // const dec2 = decrypt(encryptTest2, "41435231323535552d4a312041757458");
    // console.log(
    //   "decTaco test2 returns array: ",
    //   JSON.parse(dec2.toString(CryptoJS.enc.Utf8))
    // );

    // const encryptTest3 = encrypt(
    //   JSON.stringify({ test: "hola, id:1" }),
    //   "41435231323535552d4a312041757458"
    // );
    // console.log("encTaco test3 object ", encryptTest3);

    // const dec3 = decrypt(encryptTest3, "41435231323535552d4a312041757458");
    // console.log(
    //   "decTaco test3 returns object: ",
    //   JSON.parse(dec3.toString(CryptoJS.enc.Utf8))
    // );
    // const number = 10;
    // const encryptTest4 = encrypt(
    //   number.toString(),
    //   "41435231323535552d4a312041757458"
    // );
    // console.log("encTaco test4 number  ", encryptTest4);

    // // casting to number?
    // const dec4 = decrypt(encryptTest4, "41435231323535552d4a312041757458");
    // console.log(
    //   "decTaco test4 returns number: ",
    //   dec4.toString(CryptoJS.enc.Utf8)
    // );

    // let bool = true;
    // let text = bool.toString();

    // const encryptTest5 = encrypt(text, "41435231323535552d4a312041757458");
    // console.log("encTaco test4 number  ", encryptTest5);

    // // casting to bool?
    // const dec5 = decrypt(encryptTest5, "41435231323535552d4a312041757458");
    // console.log(
    //   "decTaco test5 returns bool: ",
    //   dec5.toString(CryptoJS.enc.Utf8)
    // );

    // // var words = CryptoJS.enc.Hex.parse(dec);
    // // console.log("words", CryptoJS.enc.Utf8.stringify(words));

    // var key = CryptoJS.enc.Hex.parse("41435231323535552d4a312041757458");
    // var iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");
    // var encryptedBytes = CryptoJS.AES.encrypt(post.content, key, {
    //   mode: CryptoJS.mode.CBC,
    //   iv: iv,
    // });

    // var encrypted = CryptoJS.AES.encrypt("Test", key, {
    //   iv: iv,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.NoPadding,
    // });

    // console.log("encryptedo.ciphertext", encrypted.ciphertext.toString());

    // var dencrypted = CryptoJS.AES.decrypt(encrypted, key, {
    //   iv: iv,
    //   mode: CryptoJS.mode.CBC,
    //   padding: CryptoJS.pad.NoPadding,
    // });
    // console.log("deenc", dencrypted, CryptoJS.enc.Hex.stringify(dencrypted));

    // console.log(
    //   "encryptedSTR.ciphertext",
    //   encryptedBytes.ciphertext.toString()
    // );
    // console.log("encryptedSTR.iv", encryptedBytes.iv.toString());

    //if (!encryptedBytes) return "";
    // const base64Encrypted = uint8ToBase64(encryptedBytes);

    // const base64IV = btoa(iv);
    // //const encryptObject = atob("fivxDklUg7lwkfV9_SQFPTpwJzu5IpDUIvPqHxl/i8zA=");
    // const decrypttext = CryptoJS.AES.decrypt(encryptedBytes, key, { iv: iv });

    // console.log("encryptObject", decrypttext);

    // const result = `${base64IV}_${base64Encrypted}`;
    // console.log("result", result);
    // setContentEncrypted(result);
  };

  return (
    <View className="flex flex-col border-t-2 border-gray-500 p-4">
      <TextInput
        className="mb-2 rounded border-2 border-gray-500 p-2"
        onChangeText={setTitle}
        placeholder="Title"
        value={title}
      />
      <TextInput
        className="mb-2 rounded border-2 border-gray-500 p-2"
        onChangeText={setContent}
        placeholder="Content"
        value={content}
      />
      <TextInput
        className="mb-2 rounded border-2 border-gray-500 p-2"
        onChangeText={setContent}
        placeholder="EncryptedContent"
        value={contentEncrypted}
      />
      <TouchableOpacity
        className="rounded bg-indigo-500 p-2"
        onPress={() => encryptText()}
      >
        <Text className="font-semibold text-white">Encrypt Text</Text>
      </TouchableOpacity>
    </View>
  );
};

export const HomeScreen = () => {
  //const postQuery = trpc.post.all.useQuery();

  const postQuery = [
    { id: 1, title: "test1", content: "asdasdasdasdas" },
    { id: 2, title: "test2", content: "asdasdasd asd asd asdasdas" },
  ];

  // const postQuery = trpc.post.all.useQuery();

  const [showPost, setShowPost] = React.useState<string | null>(null);

  return (
    <SafeAreaView className="bg-[#2e026d] bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold">
          <Text className="text-indigo-500">Crypto</Text> test
        </Text>

        <View className="py-2">
          {showPost ? (
            <Text>
              <Text className="font-semibold">Selected test:</Text>
              {showPost.id}
            </Text>
          ) : (
            <Text className="font-semibold italic">Press on a test</Text>
          )}
        </View>

        <FlashList
          data={postQuery}
          // data={postQuery.data}

          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(p) => (
            <TouchableOpacity onPress={() => setShowPost(p.item)}>
              <PostCard post={p.item} />
            </TouchableOpacity>
          )}
        />

        <RunCryptoTest post={showPost} />
      </View>
    </SafeAreaView>
  );
};
