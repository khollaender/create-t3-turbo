import { Buffer } from "buffer";

import cryp from "isomorphic-webcrypto";

cryp.subtle
  .digest({ name: "SHA-256" }, new Uint8Array([1, 2, 3]).buffer)
  .then((hash) => {
    // hashes are usually represented as hex strings
    // hex-lite makes this easier
    const hashString = Buffer.from(hash).toString("hex");
    console.log("hashString", hashString);
  });
