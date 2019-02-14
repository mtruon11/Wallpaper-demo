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
		dir: '/public/images/uploads',
		s3: s3,
		bucket: 'wallpaper-public',
		acl: 'public-read',
		metadata: function(req, file, cb){
			cb(null, {fieldName: file.fieldName});
		},
		key: function(req, file, cb) {
			cb(null, Date.now().toString() + '-' + file.originalName)	
		}
    	})
})

const storageForEmployee = multer({
	storage: multerS3({
		dir:'/public/images/employees',
		s3: s3,
		bucket: 'wallpaper-public',
		acl: 'public-read',
		metadata: function(req, file, cb){
			cb(null, {fieldName: file.fieldName});
		},
		key: function(req, file, cb){
			cb(null, Date.now().toString() + '-' + file.originalName)
		}
	})
})

const storageForVendor = multer({
	storage: multerS3({
		dir:'/public/images/vendors',
		s3: s3,
		bucket: 'wallpaper-public',
		acl: 'public-read',
		metadata: function(req, file, cb){
			cb(null, {fieldName: file.fieldName});
		},
		key: function(req, file, cb){
			cb(null. Date.now().toString() + '-' + file.originalName)
		}
	})
})

module.exports = {
    uploadProduct: storageForProduct,
    uploadForEmployee: storageForEmployee,
    uploadForVendor: storageForVendor
}
