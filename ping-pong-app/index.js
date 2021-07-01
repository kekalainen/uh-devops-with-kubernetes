const http = require('http');

let count = 0;

http
	.createServer((req, res) => {
		if (req.url == '/count') {
			res.write(count.toString());
			res.end();
		} else {
			res.write('pong ' + count);
			res.end();
			count += 1;
		}
	})
	.listen(8080);
