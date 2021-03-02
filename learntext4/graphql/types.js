const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
} = require("graphql")

const { User, Post, Comment } = require("../models")

const UserType = new GraphQLObjectType({
  name: "User",
  description: "用户类型",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    displayName: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args){
        return Post.find({
          authorId: parent.id
        })
      }
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args) {
        return Comment.find({
          userId: parent.id
        })
      }
    }
  }),
})

const PostType = new GraphQLObjectType({
  name: "Post",
  description: "文章类型",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
    author: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.authorId)
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parent, args) {
        return Comment.find({ postId: parent.id })
      },
    },
  }),
})

const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "评论类型",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId)
      },
    },
    post: {
      type: PostType,
      resolve(parent, args) {
        return Post.findById(parent.postId)
      },
    },
  }),
})

module.exports = { UserType, PostType, CommentType }
