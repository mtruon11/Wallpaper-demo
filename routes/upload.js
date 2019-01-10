const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback) { 
        callback(null, './public/images/uploads')
    },
    filename: function(req, file, callback){
        callback(null, Date.now().toString() + '-' + file.originalname)
    }
})

const upload = multer({
    storage: storage
});

module.exports = upload;