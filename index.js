const http = require("https");
const crypto = require("crypto");

const hash = "0000000000000bae09a7a393a8acded75aa67e46cb81f7acaa5ad94f9eacd103";
//const difficulty = 7;
const iterates = 2000;

function rev(str) {
  const splt = str.split(/(..)/g).filter((s) => s);
  const res = [];
  for (i = splt.length - 1; i >= 0; i--) {
    res.push(splt[i]);
  }
  return res.join("");
}

http.get(`https://blockchain.info/rawblock/${hash}`, (res) => {
  let data = "";
  res.on("data", (chunk) => {
    data += chunk;
  });
  res.on("end", () => {
    data = JSON.parse(data);
    let it = 0;
    let curr_clc_hash = "";
    while (curr_clc_hash != hash) {
      const date = data.time.toString(16);
      const nonce = data.nonce.toString(16);
      const version = Buffer.alloc(4).writeInt32LE(data.ver, 0).toString(16);
      const dct = it.toString(16);
      const merkel = data.mrkl_root;
      const prev_hash = data.prev_block;
      const hsh = Buffer.from(
        rev(nonce + dct + date + merkel + prev_hash + version),
        "hex"
      );
      const first_hash = Buffer.from(
        crypto.createHash("sha256").update(hsh).digest("hex"),
        "hex"
      );
      curr_clc_hash = rev(
        crypto.createHash("sha256").update(first_hash).digest("hex")
      );
      console.log(curr_clc_hash);
      it++;
    }
  });
});
