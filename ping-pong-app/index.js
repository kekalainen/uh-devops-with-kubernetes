const http = require('http');
const { Sequelize, DataTypes } = require('sequelize');

(async function () {
	const sequelize = new Sequelize(
		'postgres',
		'postgres',
		process.env.POSTGRES_PASSWORD,
		{
			host: 'postgres-service',
			dialect: 'postgres',
			logging: false,
		}
	);

	const Pong = sequelize.define('Pong', {
		count: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0,
		},
	});

	await sequelize.sync({ alter: true });

	let [pong, created] = await Pong.findOrCreate({ where: {} });

	http
		.createServer((req, res) => {
			if (req.url == '/count') {
				res.write(pong.count.toString());
				res.end();
			} else {
				res.write('pong ' + pong.count);
				res.end();
				pong.increment({ count: 1 });
			}
		})
		.listen(8080);
})();
