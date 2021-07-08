const { connect, JSONCodec } = require('nats');
const https = require('https');

(async () => {
	const nc = await connect({
		servers: process.env.NATS_HOST,
		maxReconnectAttempts: -1,
	});
	const jc = JSONCodec();
	const sub = nc.subscribe('todos', { queue: 'broadcaster' });
	(async () => {
		console.log('Subscription opened');

		for await (const m of sub) {
			console.log('Received a message, sending a web request');

			payload = jc.decode(m.data);

			const data = JSON.stringify({
				embeds: [
					{
						title: `Todo ${payload.event}d`,
						description: '```json\n' + JSON.stringify(payload.data) + '```',
					},
				],
			});

			const options = {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Content-Length': data.length,
				},
			};

			const req = https
				.request(process.env.WEBHOOK_URL, options, (res) => {
					console.log('Response status:', res.statusCode);
				})
				.on('error', (e) => {
					console.error(e);
				});

			req.write(data);
			req.end();
		}

		console.log('Subscription closed');
	})();
})();
