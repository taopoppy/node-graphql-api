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

// 设置跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

// 中间件鉴权
app.use(authenticate)

app.get("/", (req, res) => {
  res.json({ msg: "Welcome! Go to /graphql" })
})

// graphql服务器
app.use("/graphql",graphqlHTTP({
    schema,
    graphiql: true,
  })
)

app.listen(4000, () => {
  console.log(`App running on PORT 4000`)
})
