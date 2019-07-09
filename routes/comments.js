const express = require('express');
const db = require('../models');
// const multer = require('multer');
// const cloudinary = require('cloudinary');
// const upload = multer({dest: './uploads'});
const router = express.Router();
// var app = express();
router

router.post('/:id/comments', function(req, res){
  db.post.findByPk(parseInt(req.params.id))
    .then(function(post){
        post.createComment({
            comment: req.body.comment,
            name:req.body.name
        }).then(function(comment){
            res.redirect('/users/'+ req.user.id);
        })
    })
});

module.exports = router;