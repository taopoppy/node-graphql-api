const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config.js')

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization? req.headers.authorization.split(" ")[1] : ""

  try {
    if(token!==""){
      const verified = jwt.verify(token, JWT_SECRET)
      req.verifiedUser = verified.user
      console.log("Verification success!", verified)
    }
    next()
  } catch (err) {
    console.log("Verification failed!", err)
    next()
  }
}

module.exports = { authenticate }
