const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 产品要保存在mongodb中的数据结构，id会自动生成
const productSchema = new Schema({
	name: String,
	category:String,
	companyId:String
})

// 为productSchema这个Schema起一个model别名Product
module.exports = mongoose.model('Product', productSchema)