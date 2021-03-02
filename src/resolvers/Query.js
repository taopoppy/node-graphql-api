const { User, Post, Comment, UserModel } = require('../models/index.js')
const { authenticate } = require('../middleware/auth')

const Query = {
	comments(parent, args, ctx, info) {
		const { db } = ctx
		return db.allComments
	},
	async users(parent, args, ctx, info) {
		const { req, pubsub } = ctx

		// 查看用户先鉴权
		const decodeResult = authenticate(req)
		const {id, email} = decodeResult
		// 判断author是否存在
		const user = await UserModel.findOne({_id: id, email})
		if(!user) {
			throw new Error("用户不存在")
		}

		const { query } = args
		let userone
		if(query) {
			userone = await UserModel.findById(query)
			if(!userone) {
				throw new Error("用户不存在")
			}
		} else {
			userone = await UserModel.find()
		}
		return userone
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