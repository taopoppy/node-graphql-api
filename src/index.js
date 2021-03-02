const { GraphQLServer, PubSub } = require('graphql-yoga')
const { connectDB } = require('./db/index')
const { Query } = require('./resolvers/Query')
const { Comment } = require('./resolvers/Comment')
const { Mutation } = require('./resolvers/Mutation')
const { Post } = require('./resolvers/Post')
const { User } = require('./resolvers/User')
const { Subscription } = require('./resolvers/Subscription')

// 订阅实现
const pubsub = new PubSub()

// Resolvers(函数实现)
const resolvers= {
	Comment,
	User,
	Post,
	Query,
	Mutation,
	Subscription
}

// 创建Graphql服务器
const server = new GraphQLServer({
	typeDefs:'./src/schema.graphql',
	context: (req)=> ({
		pubsub,
		req
	}),
	resolvers,
})

// 连接数据库
connectDB()


// 设置跨域
server.express.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


server.start(()=> {
	console.log("Server is running on localhost:4000")
})