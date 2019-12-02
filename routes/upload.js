const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
	secretAccessKey: process.env.S3_SECRET_KEY,
	accessKeyId: process.env.S3_ACCESS_KEY,
	region: "us-east-1"
});

const s3 = new aws.S3();

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/uploads/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

const storageForProduct = multer({
	storage: storage
})

// const storageForProduct = multer({
// 	storage: multerS3({
// 		s3: s3,
// 		bucket: 'wallpaper-demo',
// 		key: function(req, file, cb) {
// 			cb(null,'public/images/uploads/' + file.originalname)	
// 		}
//     	})
// })

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images/employees/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})
const storageForEmployee = multer({
	storage: storage
	// storage: multerS3({
	// 	s3: s3,
	// 	bucket: 'wallpaper-demo',
	// 	key: function(req, file, cb){
	// 		cb(null,'public/images/employees/' + file.originalname)
	// 	}
	// })
})

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, './public/images/vendors/')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

const storageForVendor = multer({
	storage: storage
	// storage: multerS3({
	// 	s3: s3,
	// 	bucket: 'wallpaper-demo',
	// 	key: function(req, file, cb){
	// 		cb(null,'public/images/vendors/' + file.originalname)
	// 	}
	// })
})

module.exports = {
    uploadProduct: storageForProduct,
    uploadForEmployee: storageForEmployee,
    uploadForVendor: storageForVendor
}
