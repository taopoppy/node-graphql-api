const express = require("express")
const dotenv = require("dotenv")
const { graphqlHTTP } = require("express-graphql")
const schema = require("./graphql/schema")
const { connectDB } = require("./db")
const app = express()

// 环境常量生效
dotenv.config()
// 连接数据库
connectDB()

const { authenticate } = require("./middleware/auth")

// 中间件鉴权
app.use(authenticate)

app.get("/", (req, res) => {
  res.json({ msg: "Welcome! Go to /graphql" })
})

//
app.use("/graphql",graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(4000, () => {
  console.log(`App running on PORT 4000`)
})
