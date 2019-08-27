const fs = require("fs");
const readline = require("readline");

const filename = process.argv.slice(2)[0];
let contents = "";

const rl = readline.createInterface({
  input: fs.createReadStream(filename)
});

rl.on("line", line => {
  if (line[0] === 'v') {
    contents += "v";
    for (let part of line.substr(2).split(" ")) {
      contents += ` ${parseFloat(part)}`;
    }
    contents += "\n";
  }
  if (line[0] === 'f') {
    contents += `${line}\n`;
  } 
});

rl.on("close", () => {
  fs.writeFileSync(filename, contents.slice(0, -1));
});