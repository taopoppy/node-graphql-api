const { v4: uuidv4 } = require('uuid')

const Mutation = {
	createUser(parent, args, ctx, info) {
		const { db } = ctx
		const { data } = args
		const emailToken = db.allUsers.some((user)=> {
			return user.email===data.email
		})
		if(emailToken){
			throw new Error("邮箱已经被占用")
		}
		// 创建新的作者对象
		const user = {
			id: uuidv4(),
			...data
		}
		db.allUsers.push(user) // 将新的用户保存在数据库当中
		return user // 返回新的用户信息
	},
	createPost(parent, args, ctx, info) {
		const { db } = ctx
		const { data } = args
		// 判断author是否存在
		const authorExist = db.allUsers.some((user)=> {
			return user.id === data.author
		})
		// 如果作者不存在，返回错误
		if(!authorExist) {
			throw new Error("作者不存在")
		}

		// 创建新的文章对象
		const post={
			id: uuidv4(),
			...data
		}

		db.allPosts.push(post) // 将文章保存在数据库
		return post // 返回新的文章信息
	},
	createComment(parent, args, ctx, info) {
		const { db } = ctx
		const { data } = args
		// 判断作者和文章是否存在
		const authorExist = db.allUsers.some((user)=> {
			return user.id === data.author
		})
		const postExist = db.allPosts.some((pos)=> {
			return pos.id === data.post && pos.published // 这里要判断文章存在的同时也要判断文章是否是公开的
		})

		if(!authorExist || !postExist){
			throw new Error("作者或者文章不存在")
		}
		// 创建新的评论对象
		const comment = {
			id: uuidv4(),
			...data
		}

		db.allComments.push(comment) // 将评论保存在数据库当中
		return comment
	},
	deleteUser(parent,args,ctx, info){
		const { db } = ctx
		const { id } = args
		const user = db.allUsers.find((user)=> user.id === id)
		if(!user) {
			throw new Error("作者不存在")
		}
		// 1. 删除作者
		db.allUsers = db.allUsers.filter((user)=> user.id !==id)

		// 2. 同时要删除该作者写的文章
		db.allPosts = db.allPosts.filter((post) => {
			const match = post.author === id
			// 同时删除该文章下的所有评论
			if(match) {
				db.allComments = db.allComments.filter((comment)=> comment.post!==post.id)
			}

			return !match
		})

		// 3. 最后要删除该作者所发表的所有评论
		db.allComments = db.allComments.filter((comment)=> comment.author!==id)
		return user
	},
	deletePost(parent,args,ctx,info) {
		const { db } = ctx
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

		return post
	},
	deleteComment(parent,args,ctx,info){
		const { db } = ctx
		const { id } = args
		// 1.先检查评论存在否
		const comment = db.allComments.find((comment) => comment.id ===id)
		if(!comment){
			throw new Error("评论不存在")
		}

		// 2. 删除评论
		db.allComments = db.allComments.filter((comment)=> comment.id!==id)

		return comment
	},
	updateUser(parent, args, ctx, info) {
		const { db } = ctx
		const { id, data } = args
		// 判断用户是否存在
		const user = db.allUsers.find((user)=> user.id === id)
		if(!user) {
			throw new Error("用户不存在")
		}

		// 判断邮箱需要保证唯一性
		if(typeof data.email === 'string') {
			const emailToken = db.allUsers.some((user)=> user.email ===data.email)
			if(emailToken){
				throw new Error("新的邮箱已经被占用")
			}
			user.email = data.email
		}
		// 修改名称和年龄比较随意
		if(typeof data.name === 'string') {
			user.name = data.name
		}
		// age也可以为null
		if(typeof data.age !== 'undefined') {
			user.age = data.age
		}
		return user
	},
	updatePost(parent, args, ctx, info) {
		const { db } = ctx
		const { id, data } = args
		// 检查更新的文章是否存在
		const post = db.allPosts.find((post) => post.id === id)
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
		}
		return post
	},
	updateComment(parent, args, ctx, info) {
		const { db } = ctx
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
		return comment
	}
}

module.exports = {
	Mutation
}