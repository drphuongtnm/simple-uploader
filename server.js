const net = require("net");
const fs = require("fs/promises");

const server = net.createServer(() => {});


server.on("connection", (socket) => {
  let fileHandle, fileWriteStream;
  console.log("New connection !");
  
  socket.on("data", async (data) => {

    if (!fileWriteStream) {
      socket.pause(); // pause to open the file first

      const indexOfDivider = data.indexOf("-----")
      const fileName = data.subarray(10, indexOfDivider).toString("utf-8")

      fileHandle = await fs.open(`storage/${fileName}`, "w");
      fileWriteStream = fileHandle.createWriteStream(); // the stream to write to

      // writing to our destination file, discard the headers
      fileWriteStream.write(data.subarray(indexOfDivider + 5))
      socket.resume();
      fileWriteStream.on("drain", () => {
        socket.resume();
      });
    } else {
      // writing to our destination file
      if (!fileWriteStream.write(data)) {
        socket.pause();
      }
    }
  });

  // this end event  happends when the client.js file closes the socket 

  const handleConnectionEnded = async () => {
    console.log("Connection ended !");
    fileHandle?.close();
  };

  socket.on("end", handleConnectionEnded);
  socket.on("error", handleConnectionEnded);
});

server.listen(5050, "::1", () => {
  console.log("Uploader server opened on: ", server.address());
});
