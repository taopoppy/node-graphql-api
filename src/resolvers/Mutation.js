const { v4: uuidv4 } = require('uuid')
const { UserModel, PostModel, CommentModel} = require('../models/index.js')
const { createJwtToken, authenticate } = require('../middleware/auth')
const User = require('../models/User.js')

const Mutation = {
	// 登录
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
	// 创建新用户
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
	// 创建新文章
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
	// 创建新评论
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
	// 删除用户
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
		// 删除自己
		const userDeleted = await User.findByIdAndDelete(id)
		if(!userDeleted) {
			throw new Error("删除失败")
		}

		// 2. 同时要删除该作者写的文章
		// db.allPosts = db.allPosts.filter((post) => {
		// 	const match = post.author === id
		// 	// 同时删除该文章下的所有评论
		// 	if(match) {
		// 		db.allComments = db.allComments.filter((comment)=> comment.post!==post.id)
		// 	}

		// 	return !match
		// })

		// 3. 最后要删除该作者所发表的所有评论
		// db.allComments = db.allComments.filter((comment)=> comment.author!==id)
		// return user
		return userDeleted
	},
	// 删除文章
	async deletePost(parent,args,ctx,info) {
		const { db, pubsub } = ctx
		const { id } = args
		// 1.先检查文章存在否
		const post = db.allPosts.find((post) => post.id ===id)
		if(!post){
			throw new Error("文章不存在")
		}

		// 2. 删除文章
		db.allPosts = db.allPosts.filter((post)=> post.id!==id)

		// 3. 删除该文章下面所有的评论
		db.allComments = db.allComments.filter((comment)=> comment.post!==id)
		if(post.published) {
			pubsub.publish("post", {
				post: {
					mutation: "DELETED",
					data: post
				}
			})
		}
		return post
	},
	// 删除评论
	async deleteComment(parent,args,ctx,info){
		const { db,pubsub } = ctx
		const { id } = args
		// 1.先检查评论存在否
		const comment = db.allComments.find((comment) => comment.id ===id)
		if(!comment){
			throw new Error("评论不存在")
		}

		// 2. 删除评论
		db.allComments = db.allComments.filter((comment)=> comment.id!==id)
		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "DELETED",
				data: comment
			}
		})
		return comment
	},
	// 更新用户信息
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

		const { username, email, age, password } = data

		// 判断邮箱需要保证唯一性
		const emailExist = await UserModel.findOne({email})
		if(emailExist) {
			throw new Error("新的邮箱已经被占用")
		}

		const userUpdated = await UserModel.findByIdAndUpdate(
		id,
		{
			username: username!=undefined? username: user.username,
			email: email!==undefined? email: user.email,
			age: age!=undefined? age: user.age,
			password: password!=undefined? password: user.password,
		}
		)
		if(!userUpdated){
			throw new Error("更新失败")
		}

		return userUpdated
	},
	async updatePost(parent, args, ctx, info) {
		const { db,pubsub } = ctx
		const { id, data } = args
		// 检查更新的文章是否存在
		const post = db.allPosts.find((post) => post.id === id)
		const oldPost = {...post}
		if(!post) {
			throw new Error("要修改的文章不存在")
		}
		// 判断标题
		if(typeof data.title === 'string') {
			post.title = data.title
		}
		// 判断内容
		if(typeof data.body === 'string') {
			post.body = data.body
		}
		// 判断上传
		if(typeof data.published === 'boolean') {
			post.published = data.published
			if(!oldPost.published && post.published) {
				// 文章的published属性由false变为true叫做created
				pubsub.publish("post", {
					post: {
						mutation: "CREATED",
						data: post
					}
				})
			}
			if(oldPost.published && !post.published) {
				// 文章的published属性由true变为false叫做delete
				pubsub.publish("post", {
					post: {
						mutation: "DELETED",
						data: post
					}
				})
			}
		} else if(post.published) {
			// 文章的标题和内容在published为true的情况下变化才叫updated
			pubsub.publish("post", {
				post: {
					mutation: "UPDATED",
					data: post
				}
			})
		}

		return post
	},
	async updateComment(parent, args, ctx, info) {
		const { db, pubsub } = ctx
		const { id, data } = args
		// 检查评论是否存在
		const comment = db.allComments.find((comment)=> comment.id === id)
		if(!comment) {
			throw new Error("要修改的评论不存在")
		}
		// 判断评论内容
		if(typeof data.text === 'string') {
			comment.text = data.text
		}
		pubsub.publish(`comment ${comment.post}`, {
			comment: {
				mutation: "UPDATED",
				data: comment
			}
		})
		return comment
	}
}

module.exports = {
	Mutation
}