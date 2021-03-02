const mongoose = require("mongoose")

// 评论要保存在mongodb中的格式
const commentSchema = new mongoose.Schema(
  {
    // 评论内容
    text: {
      type: String,
      required: true,
    },
    // 用户id
    authorId: {
      type: String,
      required: true,
    },
    // 评论所属文章id
    postId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("comment", commentSchema)
