const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, callback) { 
        callback(null, './uploads')
    },
    filename: function(req, file, callback){
        callback(null, file.filename + '-' + Date.now)
    }
})

const upload = multer({
    storage: storage
},
{
    limits: 
    {
        fileSize: 5e6,
        fieldNameSize: 100
    }
}
).array('images');

module.exports = upload;