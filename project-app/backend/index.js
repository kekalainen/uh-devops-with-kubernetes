const fs = require('fs');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
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

	console.log('Waiting for a database connection');
	while (true) {
		try {
			await sequelize.authenticate();
			break;
		} catch (err) {
			await new Promise((resolve) => setTimeout(resolve, 1000));
		}
	}

	const Todo = sequelize.define('Todo', {
		content: {
			type: DataTypes.STRING(140),
			allowNull: false,
			defaultValue: '',
		},
	});

	await sequelize.sync({ alter: true });

	var root = {
		createTodo: ({ content }) => {
			return Todo.create({ content: content });
		},
		todos: () => {
			return Todo.findAll();
		},
	};

	var app = express();
	app.use(express.json());
	app.use((req, res, next) => {
		if (req.path != '/healthz')
			console.log(new Date().toISOString() + ':', JSON.stringify({
				method: req.method,
				path: req.path,
				query: req.query,
				body: req.body,
			}));
		next();
	});
	app.get('/healthz', (req, res) => res.sendStatus(200));
	app.use(
		graphqlHTTP({
			schema: buildSchema(fs.readFileSync('schema.graphql', 'utf-8')),
			rootValue: root,
			graphiql: false,
		})
	);

	const port = 8070;
	app.listen(port);
	console.log('GraphQL server listening on port', port);
})();
