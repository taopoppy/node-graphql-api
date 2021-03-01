const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 公司要保存在mongodb中的数据结构，id会自动生成
const companySchema = new Schema({
	name: String,
	established: Number
})

// 为companySchema这个Schema起一个model别名Company
module.exports = mongoose.model('Company', companySchema)