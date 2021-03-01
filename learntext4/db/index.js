const mongoose = require("mongoose")
const { MONGO_URI } = require('../config.js')

const connectDB = async () => {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log(`MongoDB connected`)
}

module.exports = { connectDB }
