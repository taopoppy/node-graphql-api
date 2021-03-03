const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config')

// 为用户生成Token
const createJwtToken = (user) => {
  return jwt.sign(user, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

// 鉴权
const authenticate = (req) => {
	const header = req.request.headers.authorization
	if(!header) {
		throw new Error("no authention, please login first")
	}
  const token = header.replace("Bearer ", "")

  const decoded = jwt.verify(token, JWT_SECRET)
	return decoded
}

module.exports = {
	createJwtToken,
	authenticate
}