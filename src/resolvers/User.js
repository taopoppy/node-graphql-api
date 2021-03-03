const {  CommentModel, PostModel } = require('../models/index')

const User = {
	// 根据用户id查看用户的所有文章（完成）
	async posts(parent, args, ctx, info) {
		const userPosts = await PostModel.find({
			authorId: parent.id
		})
		return userPosts
	},
	// 根据用户id查看用户的所有评论（完成）
	async comments(parent, args, ctx, info) {
		const userComments = await CommentModel.find({
			authorId: parent.id
		})
		return userComments
	}
}

module.exports = {
	User
}