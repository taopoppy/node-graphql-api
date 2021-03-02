const { GraphQLSchema, GraphQLObjectType } = require("graphql")

// 引入query对象
const {
  users,
  user,
  posts,
  post,
  comments,
  comment
} = require("./queries")

// 引入mutation的对象
const {
  register,
  login,
  addPost,
  addComment,
  updatePost,
  deletePost,
  updateComment,
  deleteComment,
} = require("./mutations")

// 定义查询
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "查询",
  fields: { users, user, posts, post, comments, comment },
})

//定义突变
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "突变",
  fields: {
    register, // 注册
    login, // 登录
    addPost, // 新增文章
    addComment, // 新增文章
    updatePost, // 更新文章
    deletePost, // 删除文章
    updateComment, // 更新评论
    deleteComment, // 删除评论
  },
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
