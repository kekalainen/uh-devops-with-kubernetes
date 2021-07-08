const fs = require('fs');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { Sequelize, DataTypes } = require('sequelize');
const { connect, JSONCodec } = require('nats');

(async () => {
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
		done: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false,
		},
	});

	await sequelize.sync({ alter: true });

	console.log('Waiting for a NATS connection');
	const nc = await connect({
		servers: process.env.NATS_HOST,
		maxReconnectAttempts: -1,
	});
	const jc = JSONCodec();

	const publish = (subject, event, data) => {
		nc.publish(
			subject,
			jc.encode({
				event: event,
				data: data,
			})
		).catch((err) => console.log(err));
	};

	Todo.addHook('afterCreate', (todo) => publish('todos', 'create', todo));
	Todo.addHook('afterUpdate', (todo) => publish('todos', 'update', todo));

	var root = {
		createTodo: ({ content }) => {
			return Todo.create({ content: content });
		},
		updateTodo: ({ id, content, done }) => {
			return Todo.findOne({ where: { id: id } }).then((todo) => {
				if (todo)
					return todo.update({
						content: content,
						done: done,
					});
			});
		},
		todos: () => {
			return Todo.findAll();
		},
	};

	var app = express();
	app.use(express.json());
	app.use((req, res, next) => {
		if (req.path != '/healthz')
			console.log(
				new Date().toISOString() + ':',
				JSON.stringify({
					method: req.method,
					path: req.path,
					query: req.query,
					body: req.body,
				})
			);
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
