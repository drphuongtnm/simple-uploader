const net = require("net");
const fs = require("fs/promises");
const path = require("path");

const HOST = "::1";
const PORT = 5050;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  const filePath = process.argv[2];
  const fileName = path.basename(filePath);
  const fileHandle = await fs.open(filePath, "r");
  const fileReadStream = fileHandle.createReadStream(); // the stream to read from
  const fileSize = (await fileHandle.stat()).size;

  // upload progress
  let uploadedPercentage = 0;
  let bytesUploaded = 0;

  socket.write(`fileName: ${fileName}-----`);

  // read from source file
  fileReadStream.on("data", (data) => {
    if (!socket.write(data)) {
      fileReadStream.pause();
    }
    bytesUploaded += data.length; // add the number of bytes read to the variable
    let newPercentage = Math.floor((bytesUploaded / fileSize) * 100);
    if(newPercentage % 5 === 0 && newPercentage !== uploadedPercentage) {
      uploadedPercentage = newPercentage;
      // console.log(`Uploading... ${uploadedPercentage}%`);
      process.stdout.write(`\rUploading... ${uploadedPercentage}%`)

    }
  });

  socket.on("drain", () => {
    fileReadStream.resume();
  });

  fileReadStream.on("end", async () => {
    console.log("\nThe file was successfully uploaded!");
    socket.end();
  });
});
