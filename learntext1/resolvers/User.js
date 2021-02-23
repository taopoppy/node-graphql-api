const User = {
	posts(parent, args, ctx, info) {
		const { db } = ctx
		return db.allPosts.filter(post=> post.author===parent.id)
	},
	comments(parent, args, ctx, info) {
		const { db } = ctx
		return db.allComments.filter(comment=> comment.author===parent.id)
	}
}

module.exports = {
	User
}