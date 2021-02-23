const { GraphQLServer } = require('graphql-yoga')
const { db } = require('./db.js')
const { Query } = require('./resolvers/Query')
const { Comment } = require('./resolvers/Comment')
const { Mutation } = require('./resolvers/Mutation')
const { Post } = require('./resolvers/Post')
const { User } = require('./resolvers/User')

// Resolvers(函数实现)
const resolvers= {
	Comment,
	User,
	Post,
	Query,
	Mutation
}

const server = new GraphQLServer({
	typeDefs:'./src/schema.graphql',
	context: {db},
	resolvers
})

server.start(()=> {
	console.log("Server is running on localhost:4000")
})