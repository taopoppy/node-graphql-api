const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('./schema/schema')
const mongoose = require('mongoose')

const uri = "mongodb+srv://taopoppy:tao3941319=-=@cluster0.tnzd7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(uri,{
	useNewUrlParser: true,
	useUnifiedTopology: true
})
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("db connection is successful")
});

const app = express()
app.use('/graphql', graphqlHTTP({
	schema,
	graphiql:true // 打开playgroud这个grpahqlGui图形化工具
}))

app.listen(4000, ()=> {
	console.log("server is running on 4000")
})