
const upLoaderController = (req, res)=> {
	let file = req.file;
	// file信息如下
	// {
	// 	fieldname: 'avatar',
	// 	originalname: 'kq.png',
	// 	encoding: '7bit',
	// 	mimetype: 'image/png',
	// 	destination: 'public/',
	// 	filename: '6f7d1a63467c6388383cabd64240a7bb',
	// 	path: 'public\\6f7d1a63467c6388383cabd64240a7bb',
  // 	size: 98036
	// }
	// 存路径到数据库
  res.json({message: "ok",fildId: file.filename});
}

module.exports = upLoaderController