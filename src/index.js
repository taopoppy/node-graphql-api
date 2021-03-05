const { GraphQLServer, PubSub } = require('graphql-yoga')
const express = require('express')
const { connectDB } = require('./db/index')
const { Query } = require('./resolvers/Query')
const { Comment } = require('./resolvers/Comment')
const { Mutation } = require('./resolvers/Mutation')
const { Post } = require('./resolvers/Post')
const { User } = require('./resolvers/User')
const { Subscription } = require('./resolvers/Subscription')

// 文件上传库
const multer  = require('multer');
const upload = multer({ dest: 'public'}) // 文件储存路径

// 引入resuful风格的处理器
const Controller = require('./controller/index')
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

server.express.use('/static', express.static('public')) // 静态资源访问
server.express.use(express.json()) // for parsing application/json
server.express.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// restful 风格的路由
server.express.post('/api/qrImage', Controller.qrImageController) // 生成二维码返回
server.express.post('/api/uploader',upload.array('images'), Controller.upLoaderController) // 上传多张图片
server.express.get('/api/image/:id', Controller.downloadController) // 下载图片

server.start(()=> {
	console.log("Server is running on localhost:4000")
})