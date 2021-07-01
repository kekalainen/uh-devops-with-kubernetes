const http = require('http');

let count = 0;

http
	.createServer((req, res) => {
		res.write('pong ' + count);
		res.end();
		count += 1;
	})
	.listen(8080);
