const { UserModel, PostModel, CommentModel } = require('../models/index.js')
const { authenticate } = require('../middleware/auth')

const Query = {
	// 查看评论（完成）
	async comments(parent, args, ctx, info) {
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
		let commentone
		if(query!== undefined) {
			commentone = await CommentModel.findById(query)
			if(!commentone) {
				throw new Error("评论不存在")
			}
		} else {
			commentone = await CommentModel.find()
		}
		return Array.isArray(commentone)? commentone: [commentone]
	},
	// 查看用户（完成）
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
		if(query!== undefined) {
			userone = await UserModel.findById(query)
			if(!userone) {
				throw new Error("用户不存在")
			}
		} else {
			userone = await UserModel.find()
		}
		return Array.isArray(userone)? userone: [userone]
	},
	// 查看文章
	async posts(parent, args, ctx, info) {
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
		let postone
		if(query!== undefined) {
			postone = await PostModel.findById(query)
			if(!postone) {
				throw new Error("用户不存在")
			}
		} else {
			postone = await PostModel.find()
		}
		return Array.isArray(postone)? postone: [postone]
	}
}

module.exports = {
	Query
}