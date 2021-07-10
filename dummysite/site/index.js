const express = require('express');
const app = express();

app.get('*', (req, res) => res.send(process.env.DATA));

const port = 8060;
app.listen(port);
console.log('Listening on port', port);
