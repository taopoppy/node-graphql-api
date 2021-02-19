const {GraphQLServer} = require('graphql-yoga')

// 类型定义{schema}
const typeDefs = `
	type Query{
		me:User!
	}
	type User{
		id:ID!
		name:String!
		email:String!
		age:Int
	}
`

// Resolvers(函数实现)
const resolvers= {
	Query: {
		me() {
			return {
				id: "123",
				name: "Jerry",
				email:"15009571633@163.com",
				//age:15 // 这里age可以不实现，因为定义的时候没有在后面加！，说明可以为null
			}
		}
	}
}

const server = new GraphQLServer({
	typeDefs,
	resolvers
})

server.start(()=> {
	console.log("Server is running on localhost:4000")
})