const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load User model
const Employee = require('../models/Employee');

module.exports = function(passport) {
    passport.use(
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

    passport.serializeUser(function(employee, done){
        done(null, employee.id);
    });

    passport.deserializeUser(function(id, done) {
        Employee.findById(id, function(err, employee){
            done(err, employee);
        });
    });
};