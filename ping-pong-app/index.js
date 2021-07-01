const fs = require('fs');
const http = require('http');

let count = 0;

function writePongCount() {
	fs.writeFile('data/pong-count.txt', count.toString(), (err) => {
		if (err) console.error(err);
	});
}

writePongCount();

http
	.createServer((req, res) => {
		res.write('pong ' + count);
		res.end();
		count += 1;
		writePongCount();
	})
	.listen(8080);
