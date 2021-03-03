const { UserModel, PostModel } = require('../models/index')


const Comment = {
	// 根据authorId查看用户（完成）
	async author(parent, args, ctx, info) {
		const author = await UserModel.findById({
			_id: parent.authorId
		})
		return author
	},
	// 根据postId查看评论所在的文章（完成）
	async post(parent, args, ctx, info) {
		const post = await PostModel.findById({
			_id: parent.postId
		})
		return post
	}
}

module.exports = {
	Comment
}