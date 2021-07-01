const fs = require('fs');
const http = require('http');

http
	.createServer((req, res) => {
		try {
			const data = fs.readFileSync('data/status.txt', 'utf8');
			if (data) res.write(data);
		} catch (err) {
			console.error(err);
		}
		res.end();
	})
	.listen(8080);
