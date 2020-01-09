const express = require('express');
const router = express.Router();
const db = require('.././config/db.js');
const bcrypt = require('bcryptjs');
const passport = require('passport');

//Register Handle
router.post('/register', (req, res) => {
    const { firstname, lastname, username, password } = req.body;
    let errors = [];

    // Check required fields
    if (!firstname || !lastname || !username || !password) {
        errors.push({ msg: 'Please fill in all fields' });
    }

    // Check password length
    if (password.length < 6) {
        errors.push({ msg: 'Password should be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.send(errors);
    } else {
        // Validation passed
        let sql = 'SELECT username FROM users WHERE username = ?'
        let query = db.query(sql, username, (err, result) => {
            if (result.length > 0) {
                errors.push({ msg: "Username taken!" });
                res.send(errors);
            } else {
                let newUser = {
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    password: password
                }

                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt,
                    (err, hash) => {
                        if (err) throw err;
                        // Set password to hashed
                        newUser.password = hash;
                        sql = 'INSERT INTO users SET ?'
                        query = db.query(sql, newUser, (err, result) => {
                            if (err) throw err;
                            console.log(result);
                            res.redirect('/login.html');
                        });
                    }));
            }
        });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/app',
        failureRedirect: '/'
    })(req, res, next);
});

// Logout Handle
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;