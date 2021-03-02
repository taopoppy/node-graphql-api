const { PostType, CommentType } = require("./types")

const { User, Post, Comment } = require("../models")
const { GraphQLString } = require("graphql")

const { createJwtToken } = require("../util/auth")

// 注册
const register = {
  type: GraphQLString,
  description: "注册用户",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { username, email, password, displayName } = args
    const user = new User({ username, email, password, displayName })

    await user.save()
    const token = createJwtToken(user)
    return token
  },
}

// 登录
const login = {
  type: GraphQLString,
  description: "用户登录",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const user = await User.findOne({ email: args.email }).select("+password")
    console.log('user',user)
    if (!user || args.password !== user.password) {
      throw new Error("Invalid credentials")
    }

    const token = createJwtToken(user)
    return token
  },
}

const addPost = {
  type: PostType,
  description: "新增文章",
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    console.log("Verified User: ", verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthorized")
    }

    const post = new Post({
      authorId: verifiedUser._id,
      title: args.title,
      body: args.body,
    })

    return post.save()
  },
}

const updatePost = {
  type: PostType,
  description: "更新文章",
  args: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const postUpdated = await Post.findOneAndUpdate(
      {
        _id: args.id,
        authorId: verifiedUser._id,
      },
      { title: args.title, body: args.body },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!postUpdated) {
      throw new Error("No post with the given ID found for the author")
    }

    return postUpdated
  },
}

const deletePost = {
  type: GraphQLString,
  description: "删除文章",
  args: {
    postId: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    console.log(verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const postDeleted = await Post.findOneAndDelete({
      _id: args.postId,
      authorId: verifiedUser._id,
    })
    if (!postDeleted) {
      throw new Error("No post with the given ID found for the author")
    }

    return "Post deleted"
  },
}

const addComment = {
  type: CommentType,
  description: "创建新的评论",
  args: {
    comment: { type: GraphQLString },
    postId: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    const comment = new Comment({
      userId: verifiedUser._id,
      postId: args.postId,
      comment: args.comment,
    })
    return comment.save()
  },
}

const updateComment = {
  type: CommentType,
  description: "更新评论",
  args: {
    id: { type: GraphQLString },
    comment: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const commentUpdated = await Comment.findOneAndUpdate(
      {
        _id: args.id,
        userId: verifiedUser._id,
      },
      { comment: args.comment },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!commentUpdated) {
      throw new Error("No comment with the given ID found for the author")
    }

    return commentUpdated
  },
}

const deleteComment = {
  type: GraphQLString,
  description: "删除评论",
  args: {
    commentId: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    console.log(verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const commentDeleted = await Comment.findOneAndDelete({
      _id: args.commentId,
      userId: verifiedUser._id,
    })
    if (!commentDeleted) {
      throw new Error("No post with the given ID found for the author")
    }

    return "Post deleted"
  },
}

module.exports = {
  register,
  login,
  addPost,
  addComment,
  updatePost,
  deletePost,
  updateComment,
  deleteComment,
}
