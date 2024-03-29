require('dotenv').config();
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
//module allow use of sessions
var path=require('path');
const session = require('express-session');
const passport = require('./config/passportConfig')
const multer = require('multer');
const cloudinary = require('cloudinary');
const upload = multer({dest: './uploads'});
const methodOverride = require('method-override')
//module for flash messages
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn')
const helmet = require('helmet');

// This is only used by session store

const db = require('./models');
const users = require('./routes/users');


const app = express();

//This line makes the session use sequelize to write session data to a postgres table

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({
    db:db.sequelize,
    expiration: 1000 * 60 * 30
});
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(ejsLayouts);
app.use(helmet());

//Configures express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore
}));

// use this line once to set up stor table

sessionStore.sync();

//starts the flash middleware
app.use(flash());

// Link passport to the express session
//must be below session
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
})


app.get('/', function(req, res) {
  // res.send('index', pics + 'is not here');
  res.render('index');
});


app.use('/comments', require('./routes/comments'));
app.use('/', require('./routes/posts'));
app.use('/auth', require('./controllers/auth'));
app.use('/users', require('./routes/users'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
