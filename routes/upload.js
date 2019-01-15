const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback) { 
        callback(null, './public/images/uploads')
    },
    filename: function(req, file, callback){
        callback(null, Date.now().toString() + '-' + file.originalname)
    }
})

const storageForUsers = multer.diskStorage({
    destination: function(req, file, callback) { 
        callback(null, './public/images/users')
    },
    filename: function(req, file, callback){
        callback(null, Date.now().toString() + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage
});

const uploadForUsers = multer({
    storage: storageForUsers
});


module.exports = {
    upload: upload,
    uploadForUsers: uploadForUsers
}