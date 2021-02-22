const Query = {
	comments(parent, args, ctx, info) {
		const { db } = ctx
		return db.allComments
	},
	users(parent, args, ctx, info) {
		const { db } = ctx
		const { query } = args
		if(query) {
			return db.allUsers.filter(value => {
				return value.name.toLowerCase().includes(query.toLowerCase())
			})
		} else {
			return db.allUsers
		}
	},
	posts(parent, args, ctx, info) {
		const { db } = ctx
		const {query} = args
		if(query) {
			return db.allPosts.filter(value => {
				return value.title.toLowerCase().includes(query.toLowerCase()) ||
							 value.body.toLowerCase().includes(query.toLowerCase())
			})
		} else {
			return db.allPosts
		}
	}
}

module.exports = {
	Query
}