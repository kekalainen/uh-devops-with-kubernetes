const express = require('express');
const app = express();
const os = require('os');

app.get('/', (req, res) => {
	res.json({
		hostname: os.hostname(),
	});
});

const port = 8080;
app.listen(port);
console.log('Server started on port', port);
