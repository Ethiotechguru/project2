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
//module for flash messages
const flash = require('connect-flash');
const isLoggedIn = require('./middleware/isLoggedIn')
const helmet = require('helmet');

// This is only used by session store

const db = require('./models');


const app = express();

//This line makes the session use sequelize to write session data to a postgres table

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sessionStore = new SequelizeStore({
    db:db.sequelize,
    expiration: 1000 * 60 * 30
});

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

const pics = [];

app.get('/', function(req, res) {
  console.log(pics + 'is not here');
  res.render('index',  {pics:pics});
});

app.get('/profile', isLoggedIn, function(req, res) {
  res.render('profile');
});
app.post('/', upload.single('myFile'), function(req, res){
  cloudinary.uploader.upload(req.file.path, function(result){ //!why do we need a function when uploading? async request
    var imgUrl = cloudinary.url(result.public_id);
    pics.push(imgUrl)
    res.redirect('/');
  });
})

app.use('/auth', require('./controllers/auth'));
app.use('/authors', require('./routes/authors'));
app.use('/posts', require('./routes/posts'));
app.use('/tags', require('./routes/tags'));

var server = app.listen(process.env.PORT || 3000);

module.exports = server;
