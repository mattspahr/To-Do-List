const LocalStrategy = require('passport-local').Strategy;
const db = require('./db.js');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();

module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'username' }, (username, password, done) => {

            var sql = 'SELECT * FROM users WHERE username = ?'
            var query = db.query(sql, username, (err, result) => {
                if (err) return done(err);

                //Username not found
                if (!result.length) {
                    return done(null, false, { msg: "Username not registered!" })
                } else {
                    // Username found 
                    var user = {
                        username: username,
                        password: result[0].password
                    }
                    // Compare passwords
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;

                        if (isMatch) {
                            return done(null, result[0]);
                        } else {
                            // Password is incorrect
                            return done(null, false, { msg: 'Password incorrect' });
                        }
                    });
                }
            });
        })
    )

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        db.query("SELECT * FROM users WHERE id = " + id, (err, result) => {
            done(err, result[0]);
        });
    });

}