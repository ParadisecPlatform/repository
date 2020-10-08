const pairtree = require("pairtree");
const crypto = require("crypto");

let id = `/paradisec.org.au/${process.argv[2]}`;
console.log(id);

id = crypto
    .createHash("sha512")
    .update(id)
    .digest("hex");
console.log(id);
console.log(pairtree.path(id));
