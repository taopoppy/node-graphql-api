const { PostModel} = require('../models/index')

const Post = {
	author(parent, args, ctx, info) {
		const { db } = ctx
		return db.allUsers.find(user => user.id===parent.author)
	},
	comments(parent, args, ctx, info) {
		const { db } = ctx
		return db.allComments.filter(comment => comment.post===parent.id)
	}
}

module.exports = {
	Post
}