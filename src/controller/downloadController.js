const path = require('path')
const fs = require('fs')

const downloadController = (req, res) => {
	let imageId = req.params["id"]
	let filePath = path.join(__dirname,'../../public',`${imageId}`)
	const fileStream = fs.createReadStream(filePath)
	res.writeHead(200, {'Content-Type': 'image/png'})
	fileStream.pipe(res)
}

module.exports = downloadController