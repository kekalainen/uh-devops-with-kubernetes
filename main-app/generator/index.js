const fs = require('fs');

const randomString = Math.random().toString(36).substring(2);
let currentStatus = randomString;

setInterval(() => {
	currentStatus = new Date().toISOString() + ': ' + randomString;
	fs.writeFile('data/status.txt', currentStatus, (err) => {
		if (err) console.error(err);
	});
	console.log(currentStatus);
}, 5000);
