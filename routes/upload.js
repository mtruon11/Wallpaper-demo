const multer = require('multer');

const storageForProduct = multer.diskStorage({
    destination: function(req, file, callback) { 
        callback(null, './public/images/uploads')
    },
    filename: function(req, file, callback){
        callback(null, Date.now().toString() + '-' + file.originalname)
    }
})

const storageForEmployee = multer.diskStorage({
    destination: function(req, file, callback) { 
        callback(null, './public/images/employees')
    },
    filename: function(req, file, callback){
        callback(null, Date.now().toString() + '-' + file.originalname)
    }
})

const storageForVendor = multer.diskStorage({
    destination: function(req, file, callback) { 
        callback(null, './public/images/vendors')
    },
    filename: function(req, file, callback){
        callback(null, Date.now().toString() + '-' + file.originalname)
    }
})

const uploadForProduct = multer({
    storage: storageForProduct
});

const uploadForEmployee = multer({
    storage: storageForEmployee
});

const uploadForVendor = multer({
    storage: storageForVendor
});

module.exports = {
    uploadProduct: uploadForProduct,
    uploadForEmployee: uploadForEmployee,
    uploadForVendor: uploadForVendor
}