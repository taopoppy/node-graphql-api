const Subscription = {
	// 与Mutation和Query不同，这里是函数，是对象
	somethingChanged: {
		// 当客户端在订阅somethingChanged的时候，subscribe就会被调用
		subscribe(parent,args,ctx, info){
			const { pubsub } = ctx
			// 实现发布数据的功能
			let count = 0
			setInterval(() => {
				count++
				pubsub.publish("something_topic", {
					somethingChanged: count
				})
			}, 1000);

			return pubsub.asyncIterator("something_topic") // 返回一个通道，通道名称为something_topic
		}
	},

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