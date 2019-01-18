const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

//Load Employee model
const Employee = require('../models/Employee');

//Load Employee model
const User = require('../models/User');

module.exports = function(passport) {
    passport.use('employee-local',
        new LocalStrategy({usernameField: 'email'} , (email, password, done) => {
            //Match user
            Employee.findOne({
                email: email
            }).then( employee => {
                if (!employee) {
                    return done(null, false, {message: 'That email is not registered'});
                }

                // Match password
                bcrypt.compare(password, employee.password, (err, isMatch) => {
                    if(err) throw err;
                    if(isMatch) {
                        console.log('Employee: ' + employee.email + ' logged in.')
                        return done(null, employee);
                    } else {
                        return done(null, false, {message:'Password incorrect'});
                    }
                });

            });
        })
    );
    passport.use('user-local',
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

    function PrincipleInfo(principleId, principleType, details){
        this.principleId = principleId;
        this.principleType = principleType;
        this.details = details;
    }

    passport.serializeUser(function(userObj, done){
        var userPrototype = Object.getPrototypeOf(userObj);
        var principleType = 'User';

        if(userPrototype === User.prototype) {
            principleType = 'User';
        } else {
            principleType = 'Employee';
        }
        var principleInfo = new PrincipleInfo(userObj.id, principleType, '');
        done(null, principleInfo);
    });

    passport.deserializeUser(function(principleInfo, done) {
        if(principleInfo.principleType == 'User'){
            User.findById(principleInfo.principleId, function(err, user) {
                done(err, user)
            });
        } else {
            Employee.findById(principleInfo.principleId, function(err, employee){
                done(err, employee);
            });
        }
    });
};