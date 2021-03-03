const { PostModel, UserModel, CommentModel} = require('../models/index')

const Post = {
	// 根据文章的authorid查看用户（完成）
	async author(parent, args, ctx, info) {
		const author = await UserModel.findById({
			_id: parent.authorId
		})
		return author
	},
	// 根据文章查看文章下的所有评论（完成）
	async comments(parent, args, ctx, info) {
		const comments = await CommentModel.find({
			postId: parent._id
		})
		return comments
	}
}

module.exports = {
	Post
}