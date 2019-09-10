const fs = require("fs");

const MAX_BYTES = 13312;
const filename = "./dist.zip";

function getFilesizeInBytes(filename) {
  return fs.statSync(filename).size;
}

function fileIsUnderMaxSize(fileSize) {
  return fileSize <= MAX_BYTES;
}

fileSize = getFilesizeInBytes(filename);
fileSizeDifference = Math.abs(MAX_BYTES - fileSize);

if (fileIsUnderMaxSize(fileSize)) {
  console.log(
    `Hooray! The file is ${fileSize} bytes (${fileSizeDifference} bytes under the limit).`,
  );
  process.exit(0);
} else {
  console.log(`Nuts! The file is ${fileSize} bytes (${fileSizeDifference} bytes over the limit).`);
  process.exit(1);
}
