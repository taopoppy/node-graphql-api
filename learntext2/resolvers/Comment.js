const Comment = {
	author(parent, args, ctx, info) {
		const { db } = ctx
		return db.allUsers.find(user => user.id===parent.author)
	},
	post(parent, args, ctx, info) {
		const { db } = ctx
		return db.allPosts.find(post => post.id===parent.post)
	}
}

module.exports = {
	Comment
}