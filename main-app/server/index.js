const fs = require('fs');
const http = require('http');

http
	.createServer(async (req, res) => {
		try {
			const data = fs.readFileSync('data/status.txt', 'utf8');
			if (data) res.write(data);
		} catch (err) {
			console.error(err);
		}

		let pongs = '0';
		try {
			await new Promise((resolve, reject) => {
				http.get('http://ping-pong-service:8080/count', (res) => {
					data = '';
					res.on('data', (chunk) => {
						data += chunk;
					});
					res.on('end', () => {
						if (data) pongs = data;
						resolve();
					});
					res.on('error', (err) => {
						reject(err);
					});
				});
			});
		} catch (err) {
			console.error(err);
		}
		res.write('\nPing / Pongs: ' + pongs);

		res.end();
	})
	.listen(8080);
