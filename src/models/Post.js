const mongoose = require("mongoose")

// 文章要保存在数据库中的格式
const postSchema = new mongoose.Schema(
  {
    // 作者id
    authorId: {
      type: String,
      required: true,
    },
    // 文章标题
    title: {
      type: String,
      required: true,
    },
    // 文章内容
    body: {
      type: String,
      required: true,
    },
		// 文章是否公开
		published: {
			type: Boolean,
			required: true,
		}
  },
  { timestamps: true }
)

module.exports = mongoose.model("post", postSchema)
