const fs = require("fs");
const archiver = require("archiver");
const { execFile } = require("child_process");
const advzip = require("advzip-bin");

const distDir = process.cwd() + "/dist";
const output = fs.createWriteStream(distDir + "/zipped/game.zip");
const archive = archiver("zip", { zlib: { level: 9, memLevel: 9 } });

archive.pipe(output);
archive.directory("dist/inlined", false);
archive.finalize().then(() => {
  execFile(advzip, ["-z", "-4", "-i 20000", `./dist/zipped/game.zip`], err => {
    if (err) console.log(err);
    else console.log("ZIP file minified!");
  });
});
