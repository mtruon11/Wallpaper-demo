const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');

aws.config.update({
	secretAccessKey: process.env.S3_SECRET_KEY,
	accessKeyId: process.env.S3_ACCESS_KEY,
	region: "us-east-1"
});

const s3 = new aws.S3();

const storageForProduct = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'wallpaper-public',
		key: function(req, file, cb) {
			console.log(Date.now().toString() + '-' + file.originalname)
			cb(null,'public/images/uploads/' + Date.now().toString() + '-' + file.originalname)	
		}
    	})
})

const storageForEmployee = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'wallpaper-public',
		key: function(req, file, cb){
			console.log(Date.now().toString() + '-' + file.originalname)
			cb(null,'public/images/employees/' + Date.now().toString() + '-' + file.originalname)
		}
	})
})

const storageForVendor = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'wallpaper-public',
		key: function(req, file, cb){
			cb(null,'public/images/vendors/' + Date.now().toString() + '-' + file.originalname)
		}
	})
})

module.exports = {
    uploadProduct: storageForProduct,
    uploadForEmployee: storageForEmployee,
    uploadForVendor: storageForVendor
}
