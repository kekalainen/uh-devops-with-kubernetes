const http = require('http');

const randomString = Math.random().toString(36).substring(2);
let currentStatus = randomString;

setInterval(() => {
	currentStatus = new Date().toISOString() + ': ' + randomString;
	console.log(currentStatus);
}, 5000);

http
	.createServer((req, res) => {
		res.write(currentStatus);
		res.end();
	})
	.listen(8080);
