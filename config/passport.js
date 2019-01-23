const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcryptjs');
const keys = require('./keys');

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
            clientID: keys.facebook.api_key,
            clientSecret: keys.facebook.secret_key,
            callbackURL: keys.facebook.callbackUrl,
            profileFields:['id','displayName', 'profileUrl','emails']
        }, (accessToken, refreshToken, profile, done) => {
            console.log(profile);
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

    passport.use(
        new GoogleStrategy({
            clientID: keys.google.api_key,
            clientSecret: keys.google.secret_key,
            callbackURL: keys.google.callbackUrl,
            profileFields:['id','displayName', 'photos', 'emails']
        }, (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            var me = new User({
                email: profile.emails[0].value,
                password: accessToken,
                name: profile.displayName,
                imageUrl: profile.photos[0].value
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