const mongoose = require("mongoose")

// 用户在mongodb中的存储格式
const userSchema = new mongoose.Schema(
  {
    // 用户名称
    username: {
      type: String,
      required: true,
    },
    // 用户密码
    password: {
      type: String,
      required: true,
      select: false, // 默认不会在查询中返回
    },
		age: {
			type: Number,
			required: false
		},
    // 用户邮箱
    email: {
      type: String,
      required: true,
      unique: true, // 唯一索引
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ], // 验证器
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("user", userSchema)
