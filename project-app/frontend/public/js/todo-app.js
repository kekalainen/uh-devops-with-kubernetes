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
									content
								}
							}
						`,
					},
				})
				.then((res) => {
					this.todos = res.data.data.todos.map((todo) => todo.content);
				});
		},
		create() {
			this.$http
				.post('/', {
					query: `
						mutation {
							createTodo(content: "${this.form.content}") {
								content
							}
						}
					`,
				})
				.then((res) => {
					this.get();
				});
			this.form.content = '';
		},
	},
	created: function () {
		this.get();
	},
});
