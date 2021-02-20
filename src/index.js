const {GraphQLServer} = require('graphql-yoga')

const allUsers = [
	{id: "123", name: "wangxiaoming", email: "15009571633@163.com"},
	{id: "124", name: "taozhenchuan", email: "15008600212@163.com"},
	{id: "125", name: "bijingjing", email: "15008600289@163.com"},
]

const allPosts = [
	{ id: "12",title: "Graphql",body:"study Graphql",published:false,author: "123" },
	{ id: "13",title: "Java",body:"study Java",published:true,author: "124" },
	{ id: "14",title: "Golang",body:"study Golang",published:false,author: "124" },
	{ id: "15",title: "Javascript",body:"study Javascript",published:true,author: "125" },
]

const allComments = [
	{ id: "101", text:"nice class",author: "123",post: "12"},
	{ id: "102", text:"php is best language",author: "123",post: "14" },
	{ id: "103", text:"I wanna study typescript",author: "125",post: "15" }
]

// 类型定义{schema}
const typeDefs = `
	type Query{
		users(query:String):[User!]!
		posts(query:String): [Post]!
		comments:[Comment!]!
	}
	type User{
		id:ID!
		name:String!
		email:String!
		age:Int
		posts:[Post]!
		comments:[Comment!]!
	}
	type Post{
		id:ID!
		title:String!
		body:String!
		published:Boolean!
		author:User!
		comments:[Comment]!
	}
	type Comment{
		id:ID!
		text: String!
		author:User!
		post:Post!
	}
`

// Resolvers(函数实现)
const resolvers= {
	// type Comment的函数实现
	Comment: {
		author(parent, args, ctx, info) {
			return allUsers.find(user => user.id===parent.author)
		},
		post(parent, args, ctx, info) {
			return allPosts.find(post => post.id===parent.post)
		}
	},
	// type User的函数实现
	User: {
		posts(parent, args, ctx, info) {
			return allPosts.filter(post=> post.author===parent.id)
		},
		comments(parent, args, ctx, info) {
			return allComments.filter(comment=> comment.author===parent.id)
		}
	},
	// type Post的函数实现
	Post: {
		author(parent, args, ctx, info) {
			return allUsers.find(user => user.id===parent.author)
		},
		comments(parent, args, ctx, info) {
			return allComments.filter(comment => comment.post===parent.id)
		}
	},
	Query: {
		comments(parent, args, ctx, info) {
			return allComments
		},
		users(parent, args, ctx, info) {
			const { query } = args
			if(query) {
				return allUsers.filter(value => {
					return value.name.toLowerCase().includes(query.toLowerCase())
				})
			} else {
				return allUsers
			}
		},
		posts(parent, args, ctx, info) {
			const {query} = args
			if(query) {
				return allPosts.filter(value => {
					return value.title.toLowerCase().includes(query.toLowerCase()) ||
								 value.body.toLowerCase().includes(query.toLowerCase())
				})
			} else {
				return allPosts
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