const qr = require('qr-image')
// 加载加密库
const CryptoJS = require("crypto-js");
// 加载DES算法
const tripledes = require("crypto-js/tripledes");

const qrImageController = (req, res)=> {
	console.log("req.body", req.body)
	// 1.拿到his发来请求中携带的用户id
	const { hosptialid, insurcetype, name, sex, idcard, age } = req.body
	if(!hosptialid || !insurcetype || !name || !sex || !idcard || (typeof idcard) !== 'string'){
		res.status(400)
		res.json({
			"message":"The fields are missing or wrong"
		})
		return
	}

	// 2. 生成二维码信息
	let message = JSON.stringify({...req.body})

	// 3. 生成秘钥
	const key = idcard

	// 4. 通过对称加密DES加密信息（秘钥就是用户自己的id）
	const encryptResult = tripledes.encrypt(message, key).toString()

	// 解密写法
	// try {
	// 	let plaintext  = tripledes.decrypt(encryptResult, key).toString(CryptoJS.enc.Utf8)
	// 	console.log("plaintext",plaintext)
	// 	console.log(JSON.parse(plaintext))
	// } catch (error) {
	// 	console.log("解析失败",error.toString())
	// }

	// 5. 根据加密信息生成二维码进行返回
	const temp_qrcode = qr.image(encryptResult, {type: 'png'})
	res.writeHead(200, {'Content-Type': 'image/png'})
	temp_qrcode.pipe(res)
}

module.exports = qrImageController