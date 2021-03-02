const { GraphQLList, GraphQLID } = require("graphql")
const { UserType, PostType, CommentType } = require("./types")
const { User, Comment, Post } = require("../models")

const users = {
  type: new GraphQLList(UserType),
  description: "查询用户列表",
  resolve(parent, args) {
    return User.find()
  },
}

const user = {
  type: UserType,
  description: "查询用户",
  args: { id: { type: GraphQLID } },

  resolve(parent, args) {
    return User.findById(args.id)
  },
}

const posts = {
  type: new GraphQLList(PostType),
  description: "查询文章列表",
  resolve() {
    return Post.find()
  },
}

const post = {
  type: PostType,
  description: "查询文章",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return Post.findById(args.id)
  },
}
const comments = {
  type: new GraphQLList(CommentType),
  description: "查询评论列表",
  resolve() {
    return Comment.find()
  },
}

const comment = {
  type: CommentType,
  description: "查询评论",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return Comment.findById(args.id)
  },
}

module.exports = { users, user, posts, post, comments, comment }
