const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {ensureLoggedIn, ensureLoggedOut} = require('connect-ensure-login');
const validation = require('validator');
const csrf = require('csurf');

const csrfProtection = csrf();

// Load User model
const User = require('../models/User');

//Profile
router.get('/profile', ensureLoggedIn('/users/login'), (req, res, next) => {
  res.render('profile')
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out.');
  res.redirect('/');
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// router.use(csrfProtection);

// Login Page
router.get('/login', ensureLoggedOut('/'), csrfProtection, (req, res, next) => {
  res.render('./home/login', {
    csrfToken: req.csrfToken()
  })
});

// Register Page
router.get('/register', ensureLoggedOut('/'), csrfProtection, (req, res, next) => {
  res.render('./home/register', {
    csrfToken: req.csrfToken()
  })
});

// Register 
router.post('/register', csrfProtection, (req, res) => {
  let { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }
  
  //sanitize input
  name = validation.escape(name);
  email = validation.escape(email);
  password = validation.escape(password);
  password2 = validation.escape(password2);

  //Validate email
  if(!validation.isEmail(email)){
    errors.push({msg: 'Bad email.'})
  } else {
    email = validation.normalizeEmail(email, [
      'all_lowercase', 'gmail_remove_dots','gmail_remove_subaddress', 'gmail_convert_googlemaildotcom', 
      'outlookdotcom_remove_subaddress', 'yahoo_remove_subaddress', 'icloud_remove_subaddress'
    ])
  } 
  
  if (password != password2) {
    errors.push({ msg: 'Invalid Password.' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters.' });
  }

  if (errors.length > 0) {
    res.render('./home/register', {
      errors,
      name,
      email,
      password,
      password2,
      csrfToken: req.csrfToken()
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists.' });
        res.render('./home/register', {
          errors,
          name,
          email,
          password,
          password2,
          csrfToken: req.csrfToken()
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in.'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

router.get('/account', (req, res) => {
  res.render('./home/myAccount', {
    user: req.user
  })
});

router.get('/orders', (req, res) => {
  res.render('./home/myOrder', {
    user: req.user
  })
});


module.exports = router;
