const fs = require('fs');
const https = require('https');

const dateTomorrow = () => new Date().setHours(0, 0, 0, 0) + 86400000;

const isSameDay = (date, otherDate) =>
	date.getFullYear() === otherDate.getFullYear() &&
	date.getMonth() === otherDate.getMonth() &&
	date.getDate() === otherDate.getDate();

function updateImageOfTheDay() {
	let update = true;

	try {
		const stats = fs.statSync('data/image-of-the-day.jpg');
		if (isSameDay(new Date(), stats.mtime)) update = false;
	} catch (err) {
		console.error(err);
	}

	if (update) {
		try {
			const ws = fs.createWriteStream('data/image-of-the-day.jpg');
			https.get('https://picsum.photos/1200', (res) => {
				if (res.statusCode == 302)
					https.get(res.headers.location, (res) => {
						let stream = res.pipe(ws);
						stream.on('finish', () =>
							fs.copyFile(
								'data/image-of-the-day.jpg',
								'public/img/image-of-the-day.jpg',
								(err) => {
									if (err) console.log(err);
								}
							)
						);
					});
			});
		} catch (err) {
			console.error(err);
		}
	}
}

fs.copyFile(
	'data/image-of-the-day.jpg',
	'public/img/image-of-the-day.jpg',
	(err) => {
		if (err) console.log(err);
		updateImageOfTheDay();
	}
);

setTimeout(() => {
	updateImageOfTheDay();
	setInterval(() => {
		updateImageOfTheDay();
	}, 86400000);
}, dateTomorrow() - new Date());
