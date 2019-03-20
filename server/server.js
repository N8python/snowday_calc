const path = require('path');
const http = require('http');
const express = require('express');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

let app = express();
app.use(express.static(publicPath));
let server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server up on port ${port}.`);
})
