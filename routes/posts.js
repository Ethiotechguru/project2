const express = require('express');
const db = require('../models');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
const upload = multer({dest: './uploads'});
const isLoggedIn = require('../middleware/isLoggedIn')

router.get('profile/users/:id', isLoggedIn, function(req, res) {
    db.user.findOne({
      where: {id: parseInt(req.params.id)},
      include: [db.post]
    }).then( function(user){
    //   console.log(user)
      db.post.findAll({
          where: {
              userId: user.id,
          },
          include : [db.comment]
        }).then(function(pics) {
        //   console.log(pics[0].comments);
          res.render('profile', {user, pics });
      })
    })
  });
router.get('/users/:id', isLoggedIn, function(req, res) {
    db.user.findOne({
      where: {id: parseInt(req.params.id)},
      include: [db.post]
    }).then( function(user){
    //   console.log(user)
      db.post.findAll({
          where: {
              userId: user.id,
          },
          include : [db.comment]
        }).then(function(pics) {
        //   console.log(pics[0].comments);
          res.render('users/show', {user, pics });
      })
    })
  });
  router.delete('/posts/:id', isLoggedIn, function(req, res) {
    db.user.findOne({
      where: {id:req.user.id},
      include: [db.post]
    }).then( function(user){
    //   console.log(user)
      db.post.destroy({
          where: {
              id:req.params.id,
              userId: user.id
          }
        }).then(function(pics) {
          res.redirect('users/show');
      })
    })
  });
  
  router.post('/', upload.single('myFile'), function(req, res){
    cloudinary.uploader.upload(req.file.path, function(result){ //!why do we need a function when uploading? async request
      var imgUrl = cloudinary.url(result.public_id);
      db.post.create({
        image: imgUrl,
        caption: req.body.caption,
        userId: req.user.id
      }).then(function(post) {
        res.redirect('/users/' + req.user.id)
      })
      // pics.push(imgUrl)
      // res.redirect('/users/:id');
    });
  })

module.exports = router;