const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const bcrypt = require('bcryptjs');
const {facebook_api_key, facebook_secrey_key, callback_url} = require('./keys');

//Load User model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({usernameField: 'email'} , (email, password, done) => {
            //Match user
            User.findOne({
                email: email
            }).then( user => {
                if (!user) {
                    return done(null, false, {message: 'That email is not registered'});
                }

                // Match password
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        console.log('User: ' + user.email + ' logged in.')
                        return done(null, user);
                    } else {
                        return done(null, false, {message:'Password incorrect'});
                    }
                });

            });
        })
    );

    passport.use(
        new FacebookStrategy({
            clientID: facebook_api_key,
            clientSecret: facebook_secrey_key,
            callbackURL: "http://localhost:8080/auth/facebook/callback",
            profileFields:['id','displayName','emails']
        }, (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            console.log(profile.profileUrl);
            var me = new User({
                email: profile.emails[0].value,
                password: accessToken,
                name: profile.displayName
            });
            
            User.findOne({email: profile.emails[0].value}, (err, user) => {
                if(!user){
                    me.save((err, me) => {
                        if(err) {
                            return done(me);
                        } else { 
                            return done(null, me);
                        }
                    });
                } else {
                    done(null, user);
                }
            })
        })
    );

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user)
        });
    });
};