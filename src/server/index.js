/**
 * Required External Modules
 */
const express = require('express');
const path = require('path');
const logger = require('./middleware/logger');
const session = require('express-session');
const passport = require('passport');
const { ensureAuthenticated } = require('./config/auth');

/**
 * App Variables
 */
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

/**
 * Passport config
 */
require('./config/passport')(passport);

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 *  App Configuration
 */
app.use(express.static(path.join(__dirname, '/../public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/users', require('./routes/users'));
app.use('/api/tasks', require('./routes/api/tasks'));
app.use(logger);

/**
 * Routes Definitions
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/../public/login.html'));
});

app.get('/app', ensureAuthenticated, (req, res) =>
    res.sendFile(path.join(__dirname, '../public/app.html'))
);
