let allUsers = [
	{id: "123", name: "wangxiaoming", email: "15009571633@163.com"},
	{id: "124", name: "taozhenchuan", email: "15008600212@163.com"},
	{id: "125", name: "bijingjing", email: "15008600289@163.com"},
]

let allPosts = [
	{ id: "12",title: "Graphql",body:"study Graphql",published:true,author: "123" },
	{ id: "13",title: "Java",body:"study Java",published:true,author: "124" },
	{ id: "14",title: "Golang",body:"study Golang",published:false,author: "124" },
	{ id: "15",title: "Javascript",body:"study Javascript",published:true,author: "125" },
]

let allComments = [
	{ id: "101", text:"nice class",author: "123",post: "12"},
	{ id: "102", text:"php is best language",author: "123",post: "14" },
	{ id: "103", text:"I wanna study typescript",author: "125",post: "15" }
]

const db = {
	allUsers,
	allPosts,
	allComments
}

module.exports = {
	db
}