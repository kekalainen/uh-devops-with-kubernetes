const fs = require('fs');
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

var todos = [];

var root = {
	createTodo: ({ content }) => {
		let todo = { content: content };
		todos.push(todo);
		return todo;
	},
	todos: () => {
		return todos;
	},
};

var app = express();
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
