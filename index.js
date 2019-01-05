var express = require('express');
var app = express();
var path = require('path');
var port = (process.env.PORT || 8080); 
var dynamoDB = require('./dynamoDB');
var exphbs = require('express-handlebars');
var logger = require('morgan');
var bodyParser = require('body-parser');
var bcryptjs = require('bcryptjs');
var session = require('express-session');

app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


var docClient = dynamoDB.getDocClient();

app.get('/', function(req, res){
    res.sendFile('./views/index.html', {root: __dirname});
    // res.render('products');
})

app.get('/products', function(req, res){
    res.sendFile('./views/product.html', {root: __dirname});
})

app.get('/onSale', function(req, res){
    res.sendFile('./views/product.html', {root: __dirname});
})

app.get('/blog', function(req, res){
    res.sendFile('./views/blog.html', {root: __dirname});
})

app.get('/about', function(req, res){
    res.sendFile('./views/about.html', {root: __dirname});
})

app.get('/contact', function(req, res){
    res.sendFile('./views/contact.html', {root: __dirname});
})

app.get('/login', function(req, res){
    res.sendFile('./views/loginForm.html', {root: __dirname});
})

app.get('/register', function(req, res){
    res.sendFile('./views/registerForm.html', {root: __dirname});
})

app.post('/register', function(req, res, next){
    if(req.body.firstName && req.body.lastName 
        && req.body.email && req.body.password){
        
        var salt = bcryptjs.genSaltSync(10);
        var hashPwd = bcryptjs.hashSync(req.body.password, salt);

        var input = {
            "email": req.body.email,
            "password": hashPwd,
            "salt": salt,
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
            "created_on": new Date().toString(),
            "updated_by": "clientUser", 
            "updated_on": new Date().toString(), 
            "is_deleted": false
        };

        var params = {
            TableName: "User",
            Item: input
        };
        
        docClient.put(params, function(err, data){
            if(err){
                return next(err);
            } else {
                return res.redirect(200, 'http://localhost:8080');
            }
        });
    }
})


app.listen(port, function(){
    console.log('Server running on port 3000!')
})