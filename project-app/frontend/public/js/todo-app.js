new Vue({
	el: '#todo-app',
	data: {
		todos: [],
		form: {
			content: '',
		},
	},
	methods: {
		get() {
			this.$http
				.get('/', {
					params: {
						query: `
							query {
								todos {
									id,
									content,
									done
								}
							}
						`,
					},
				})
				.then((res) => {
					this.todos = res.data.data.todos;
				});
		},
		create() {
			this.$http
				.post('/', {
					query: `
						mutation {
							createTodo(content: "${this.form.content}") {
								id
							}
						}
					`,
				})
				.then((res) => {
					this.get();
				});
			this.form.content = '';
		},
		update(todo) {
			this.$http
				.post('/', {
					query: `
						mutation {
							updateTodo(id: "${todo.id}", content: "${todo.content}", done: ${todo.done}) {
								done
							}
						}
					`,
				})
				.then((res) => {
					this.get();
				});
		},
	},
	created: function () {
		this.get();
	},
});
