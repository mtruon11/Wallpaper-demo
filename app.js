const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session')
const path = require('path');
const bodyParser = require('body-parser');
const ensureLog = require('connect-ensure-login');

const app = express();

//Passport config
require('./config/passport')(passport);

//DB config
const db = require('./config/keys').mongoURI;

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

//Express body parser
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.json());

//Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);
 
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

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Access to public folder
app.use(express.static(path.join(__dirname, '/public')));

//Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/user.js'));
app.use('/employees', require('./routes/employee.js'));
app.use('/admin', ensureLog.ensureLoggedIn('/employees/login'), require('./routes/admin.js'));
//Handle 404 errors. The last middleware.
app.use('*', (req, res) => { res.status(404).send('404')});

// PORT 
const PORT = process.env.PORT || 8080;

app.listen(PORT, function(){
    console.log('Server running on port 8080!')
});