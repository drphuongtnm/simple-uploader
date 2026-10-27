# simple-uploader

> **Note:** This repository is for learning purposes only. It is not intended for production use.

A minimal file uploader built on Node.js's `net` module. The client streams a file over TCP to the server, which saves it to the `storage/` folder. Backpressure is handled with `pause`/`resume` and the `drain` event.

## Files

- `server.js` – TCP server on `[::1]:5050`. It reads a `fileName: <name>-----` header, then writes the rest of the stream to `storage/<name>`.
- `client.js` – connects to the server, sends the header, then streams the file and shows upload progress.
- `storage/` – where uploaded files are saved (its contents are git-ignored).

## Usage

Start the server, then upload a file from another terminal:

```bash
node server.js
node client.js tiny.file.txt
```
