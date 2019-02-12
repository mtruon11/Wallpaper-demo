const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session')
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const {ensureLoggedIn} = require('connect-ensure-login');
const MongoStore = require('connect-mongo')(session);
var fs = require('fs'); 
var debug = require('debug')('Wallpaper-demo:app.js')
var http = require('http');
var https = require('https'); 
var options = { 
    key: fs.readFileSync('./ssl/server-key.pem'), 
    cert: fs.readFileSync('./ssl/server-crt.pem'), 
    ca: fs.readFileSync('./ssl/ca-crt.pem'), 
}; 

const app = express();

require('dotenv').load();

//Passport config
require('./config/passport')(passport);

//DB config
const db = process.env.MONGO_URI;

//Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// override with POST having ?_method=DELETE
app.use((req, res, next) => {
    if(req.query._method == 'DELETE'){
        req.method = 'DELETE';
        req.url = req.path;
    } else if (req.query._method == 'PUT'){
        req.method = 'PUT';
        req.url = req.path;
    }
    next();
});

//Access to public folder
app.use(express.static(path.join(__dirname, '/public')));
//Express body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
app.use( //Express session
    session({
        secret: 'my secret session',
        resave: true,
        saveUninitialized: true,
        store: new MongoStore({
            mongooseConnection: mongoose.connection,
            autoRemove: 'native'
        }),
        cookie: {secure: true, maxAge: 24 * 60 * 60 * 1000} // 24 hrs * 60m * 60s * 1000ms
    })
);

//Connect flash
app.use(flash());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
});

var roleRequired = function(req, res, next){
    if(req.user.role.includes('Employee') || req.user.role.includes('Admin')){
        next();
    } else {
        res.status(401).send('Access Denied');
    }
}

//Routes
app.use('/', require('./routes/home/home.js'));
app.use('/cart', require('./routes/home/cart.js'));
app.use('/checkout', require('./routes/home/checkout.js'));
app.use('/products', require('./routes/home/product.js'));
app.use('/auth', require('./routes/auth-routes.js'));
app.use('/users', require('./routes/user.js'));
app.use('/admin', ensureLoggedIn('/users/login'), roleRequired, require('./routes/admin/dashboard.js'));

//Handle 404 errors. The last middleware.
app.use('*', (req, res) => { res.status(404).send('404')});

// PORT 
const PORT = normalizePort(process.env.PORT || '80');
var server = https.createServer(options, app)
server.listen(PORT, () => console.log('Server running on port '+ PORT));

server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10);
  
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
    return false;
  }

/**
 * Event listener for HTTP app.js "error" event
 */

function onError(error){
    if(error.syscall !== 'listen'){
        throw error;
    }

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server.js "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }