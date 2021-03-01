const graphql = require('graphql')
const _ = require('lodash')
const {
	GraphQLObjectType,
	GraphQLString, // 字符串类型
	GraphQLID, // ID类型
	GraphQLInt, // 整型
	GraphQLList, // 列表类型
	GraphQLNonNull, // 不能为空类型
	GraphQLSchema
} = graphql
// 引入mongoose定义的类型
const Product = require('../models/product')
const Company = require('../models/company')

const ProductType = new GraphQLObjectType({
	name: 'Product',
	fields: ()=> ({
		id: { type: GraphQLID},
		name: { type: GraphQLString},
		category: { type: GraphQLString},
		company: {// 产品要关联公司
			type: CompanyType,
			resolve(parent, args) {
				// 根据id查数据
				return Company.findById(parent.companyId)
			}
		}
	})
})

const CompanyType = new GraphQLObjectType({
	name: 'Company',
	fields: ()=> ({
		id: { type: GraphQLID},
		name: { type: GraphQLString},
		established: { type: GraphQLInt},
		products: { // 公司要关联产品
			type: new GraphQLList(ProductType),
			resolve(parent, args){
				// 根据id进行匹配
				return Product.find({
					companyId:parent.id
				})
			}
		}
	})
})

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		product: {
			type: ProductType,
			args: {
				id: { type: GraphQLID}
			},
			resolve(parent, args) {
				// 根据id查数据
				return Product.findById(args.id)
			}
		},
		products: {
			type: new GraphQLList(ProductType),
			resolve(parent, args) {
				// 查询所有数据
				return Product.find({})
			}
		},
		company: {
			type: CompanyType,
			args: {
				id: { type: GraphQLID}
			},
			resolve(parent, args) {
				return Company.findById(args.id)
			}
		},
		companies: {
			type: new GraphQLList(CompanyType),
			resolve(parent,args) {
				// 查询所有数据
				return Company.find({})
			}
		}
	}
})

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		// 增加公司
		addCompany: {
			type: CompanyType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString)}, // 非空类型
				established: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent,args) {
				// 创建一个mongoose的Models
				let company = new Company({
					name:args.name,
					established: args.established
				})
				// 存储在mongodb当中
				return company.save()
			}
		},
		// 增加产品
		addProduct: {
			type: ProductType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString)},
				category: {type: new GraphQLNonNull(GraphQLString)},
				companyId: {type: new GraphQLNonNull(GraphQLID)}
			},
			resolve(parent,args) {
				// 创建一个mongoose的Models
				let product = new Product({
					name:args.name,
					category: args.category,
					companyId: args.companyId
				})
				// 存储在mongodb当中
				return product.save()
			}
		}
	}
})


module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
})