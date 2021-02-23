const { GraphQLServer, PubSub } = require('graphql-yoga')
const { db } = require('./db.js')
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

const server = new GraphQLServer({
	typeDefs:'./src/schema.graphql',
	context: {db, pubsub},
	resolvers
})

server.start(()=> {
	console.log("Server is running on localhost:4000")
})