const Subscription = {
	comment: {
		subscribe(parent, args, ctx, info) {
			const { postId } = args
			const { db, pubsub } = ctx
			// 1. 检查订阅评论所属的文章是否存在
			const post = db.allPosts.find((post) => post.id === postId&&post.published)
			if(!post) {
				throw new Error("订阅评论所属的文章不存在")
			}

			return pubsub.asyncIterator(`comment ${postId}`) // 2.根据不同的id来定义不同的通道
		}
	},

	post: {
		subscribe(parent, args, ctx, info) {
			const { pubsub } = ctx
			return pubsub.asyncIterator(`post`)
		}
	}
}

module.exports= {
	Subscription
}