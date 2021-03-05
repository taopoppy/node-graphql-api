
const upLoaderController = (req, res)=> {
	let files = req.files;
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
	let resFileIdArray = []
	if(Array.isArray(files)) {
		resFileIdArray = files.map(file => {
			return file.filename
		})
	}
  res.json(
		{
			message: resFileIdArray.length === 0 ?"failed": "ok",
			fildId: resFileIdArray
		}
	);
}

module.exports = upLoaderController