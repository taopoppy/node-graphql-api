const jwt = require("jsonwebtoken")

const { JWT_EXPIRES_IN, JWT_SECRET } = require('../config.js')

const createJwtToken = (user) => {
  return jwt.sign({ user }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

module.exports = { createJwtToken }
