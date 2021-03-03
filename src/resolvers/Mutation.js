const { v4: uuidv4 } = require('uuid')
const { UserModel, PostModel, CommentModel} = require('../models/index.js')
const { createJwtToken, authenticate } = require('../middleware/auth')
const User = require('../models/User.js')

const Mutation = {
	// 登录（完成）
	async login(parent, args, ctx, info){
		const { data } = args
		const { email, password } = data
		const user = await UserModel.findOne({email}).select("+password")
		if(!user || user.password !== password) {
			throw new Error("用户名或者密码错误")
		}
		// 登录要返回一个token
		const token = createJwtToken({id:user._id,email:user.email})
		return {
			message: "login successfully",
			user,
			token
		}
	},
	// 创建新用户（完成）
	async createUser(parent, args, ctx, info) {
		const { data } = args
		const { email, username, password, age } = data
		const user = await UserModel.findOne({email})
		if(user){
			throw new Error("邮箱已经被占用")
		}
		// 创建新的作者对象
		const newUser = new UserModel({
			username,
			email,
			age,
			password
		})
		await newUser.save()
		return newUser
	},
	// 创建新文章（完成）
	async createPost(parent, args, ctx, info) {
		const { req, pubsub } = ctx
		const { data } = args

		// 创建新文章先要鉴权
		const decodeResult = authenticate(req)
		const {id, email} = decodeResult

		// 判断author是否存在
		const user = await UserModel.findOne({_id: id, email})
		// 如果作者不存在，返回错误
		if(!user) {
			throw new Error("作者不存在")
		}
		const { title, body, published } = data

		// 创建新的文章对象
		const newPost = new PostModel({
			title,
			body,
			published,
			authorId:id
		})
		await newPost.save()
		return newPost
	},
	// 创建新评论（完成）
	async createComment(parent, args, ctx, info) {
		const { req, pubsub } = ctx

		// 创建新文章先要鉴权
		const decodeResult = authenticate(req)
		const {id, email} = decodeResult
		// 判断author是否存在
		const user = await UserModel.findOne({_id: id, email})


		const { data } = args
		const { text, post } = data
		// 判断文章是否存在
		const postExist = await PostModel.findOne({_id: post})
		if(!postExist) {
			throw new Error("要评论的文章不存在")
		}

		// 创建新的评论对象
		const newComment = new CommentModel({
			text,
			authorId: id,
			postId: post
		})
		await newComment.save()
		return newComment
	},
	// 删除用户（完成）
	async deleteUser(parent,args,ctx, info){
		const { req, pubsub } = ctx

		// 删除用户先要鉴权
		const decodeResult = authenticate(req)
		const {id, email} = decodeResult
		// 判断author是否存在
		const user = await UserModel.findOne({_id: id, email})
		if(!user) {
			throw new Error("用户不存在")
		}

		const { userid } = args

		// 判断你要删除的id和自己的id是否一样，只能删除自己
		if(userid !== id) {
			throw new Error("无权删除其他用户")
		}
		// 1. 删除自己
		const userDeleted = await UserModel.findByIdAndDelete(id)
		if(!userDeleted) {
			throw new Error("数据库删除用户失败")
		}

		// 2. 同时要删除该作者写的文章以及文章下所有评论
		const userPosts = await PostModel.find({authorId: id})
		for(let i= 0; i< userPosts.length; i++) {
			// 删除文章下的所有评论
			let everyPost = userPosts[i]
			await CommentModel.deleteMany({postId: everyPost._id})
			// 删除文章自己
			await everyPost.delete()
		}

		// 4. 最后要删除该作者所发表的所有评论
		const commentDeleted = await CommentModel.deleteMany({authorId: id})
		if(!commentDeleted) {
			throw new Error("数据库删除用户相关文章和评论失败")
		}
		return userDeleted
	},
	// 删除文章（完成）
	async deletePost(parent,args,ctx,info) {
		const { req, pubsub } = ctx

		// 删除用户先要鉴权
		const decodeResult = authenticate(req)
		const {id, email} = decodeResult
		// 判断author是否存在
		const user = await UserModel.findOne({_id: id, email})
		if(!user) {
			throw new Error("用户不存在")
		}

		const { postid } = args
		// 判断文章是否存在
		const postDeleted = await PostModel.findById(postid)
		if(!postDeleted){
			throw new Error("要删除的文章不存在")
		}

		// 判断文章的作者是否是用户
		if(postDeleted.authorId !== id) {
			throw new Error("无法删除不是自己写的文章")
		}

		// 2. 删除文章
		const postDeletedResult = await postDeleted.delete()
		// 3. 删除该文章下面所有的评论
		const commentsDeleted = await CommentModel.deleteMany({postId:postid})
		if(!postDeletedResult && commentsDeleted) {
			throw new Error("数据库删除文章相关信息失败")
		}

		return postDeletedResult
	},
	// 删除评论（完成）
	async deleteComment(parent,args,ctx,info){
		const { req, pubsub } = ctx

		// 删除用户先要鉴权
		const decodeResult = authenticate(req)
		const {id, email} = decodeResult
		// 判断author是否存在
		const user = await UserModel.findOne({_id: id, email})
		if(!user) {
			throw new Error("用户不存在")
		}

		const { commentid } = args
		// 判断评论是否存在
		const commentDeleted = await CommentModel.findById(commentid)
		if(!commentDeleted){
			throw new Error("要删除的评论不存在")
		}

		// 判断评论的作者是否是用户
		if(commentDeleted.authorId !== id) {
			throw new Error("无法删除不是自己写的评论")
		}

		// 2. 删除评论
		const commentDeletedResult = await commentDeleted.delete()

		return commentDeletedResult
	},
	// 更新用户信息（完成）
	async updateUser(parent, args, ctx, info) {
		const { req, pubsub } = ctx
		const { data } = args

		// 创建新文章先要鉴权
		const decodeResult = authenticate(req)
		const { id } = decodeResult
		// 判断author是否存在
		const user = await UserModel.findOne({_id: id})
		console.log("user",user)
		if(!user) {
			throw new Error("用户不存在")
		}

		if(data && data.email) {
			// 判断邮箱需要保证唯一性
			const emailExist = await UserModel.findOne({email})
			if(emailExist) {
				throw new Error("新的邮箱已经被占用")
			}
		}

		const userUpdated = await UserModel.findByIdAndUpdate(id,{...data})

		if(!userUpdated){
			throw new Error("数据库更新用户失败")
		}

		return userUpdated
	},
	// 更新文章（完成）
	async updatePost(parent, args, ctx, info) {
		const { req,pubsub } = ctx
		const { postid, data } = args

		// 更新文章先要鉴权
		const decodeResult = authenticate(req)
		const { id } = decodeResult
		// 判断author是否存在
		const user = await UserModel.findOne({_id: id})
		if(!user) {
			throw new Error("用户不存在")
		}

		// 检查更新的文章是否存在
		const oldPost = await PostModel.findById(postid)
		if(!oldPost) {
			throw new Error("文章不存在")
		}
		// 判断用户是否和文章作者一致
		if(id!==oldPost.authorId) {
			throw new Error("无法修改其他作者的文章")
		}

		const { title, body, published } = data
		let newPost = {}

		// 判断标题
		if(typeof title === 'string') {
			newPost.title = title
		}
		// 判断内容
		if(typeof body === 'string') {
			newPost.body = body
		}
		if(typeof published === 'boolean') {
			newPost.published = published
		}
		// 更新文章
		const postUpdated = await PostModel.findByIdAndUpdate(postid,{...newPost})
		if(!postUpdated){
			throw new Error("数据库更新文章失败")
		}

		return postUpdated
	},
	// 更新评论（完成）
	async updateComment(parent, args, ctx, info) {
		const { req,pubsub } = ctx
		const { commentid, data } = args

		// 更新评论先要鉴权
		const decodeResult = authenticate(req)
		const { id } = decodeResult
		// 判断author是否存在
		const user = await UserModel.findOne({_id: id})
		if(!user) {
			throw new Error("用户不存在")
		}

		// 检查更新的评论是否存在
		const oldComment = await CommentModel.findById(commentid)
		if(!oldComment) {
			throw new Error("评论不存在")
		}
		// 判断用户是否和评论作者一致
		if(id!==oldComment.authorId) {
			throw new Error("无法修改其他作者的评论")
		}

		const { text } = data
		let newComment = {}

		// 判断内容
		if(typeof text === 'string') {
			newComment.text = text
		}
		// 更新评论
		const commentUpdated = await CommentModel.findByIdAndUpdate(commentid,{...newComment})
		if(!commentUpdated){
			throw new Error("数据库更新评论失败")
		}

		return commentUpdated
	}
}

module.exports = {
	Mutation
}