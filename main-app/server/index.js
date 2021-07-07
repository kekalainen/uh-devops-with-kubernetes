const fs = require('fs');
const http = require('http');

const pongCount = () =>
	new Promise((resolve, reject) => {
		http
			.get('http://ping-pong-service:8080/count', (res) => {
				data = '';
				res.on('data', (chunk) => (data += chunk));
				res.on('end', () => resolve(data));
			})
			.on('error', (err) => reject(err));
	});

(async function () {
	console.log('Waiting for ping-pong-service');
	while (true) {
		try {
			await pongCount();
			break;
		} catch (err) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	http
		.createServer(async (req, res) => {
			if (req.url == '/healthz') return res.end();

			if (process.env.MESSAGE) res.write(process.env.MESSAGE + '\n');

			try {
				const data = fs.readFileSync('data/status.txt', 'utf8');
				if (data) res.write(data);
			} catch (err) {
				console.error(err);
			}

			await pongCount()
				.then((pongs) => res.write('\nPing / Pongs: ' + pongs))
				.catch((err) => console.error(err))
				.finally(() => res.end());
		})
		.listen(8080, () => console.log('Server listening on port', 8080));
})();
