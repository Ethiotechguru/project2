const express = require('express');
const db = require('../models');
const router = express.Router();


//* GET /post/new - send a form for adding a new post
router.get('/new', function(req, res){
    db.author.findAll()
        .then(function(authors){
            res.render('posts/new', {authors:authors});
        });
});
//* GET /authors/:id - returns the selected post
router.get('/:id', function(req, res){
    db.post.findOne({
        where: {id:parseInt(req.params.id)},
        include: [db.author, db.comment, db.tag]
    }).then(function(post){
        res.render('posts/show', {post:post})
        });
});
//* POST /posts - create a new post record;

router.post('/', function(req, res){
    // db.author.findByPk(parseInt(req.body.authorId))
    //     then(function(author){
    //         author.createPost({
    //             title:req.body.title,
    //             content:req.body.content,
    //             authorId:req.body.authorId
    //         }).then(function(post){
    //             res.redirect('/posts');
    //         });
    //     });
    db.post.create({
        title: req.body.title,
        content:req.body.content,
        authorId: parseInt(req.body.authorId)
    }).then(function(post){
        res.redirect('/');
    })
})
router.post('/:id/comments', function(req, res){
    db.post.findByPk(parseInt(req.params.id))
        .then(function(post){
            post.createComment({
                content: req.body.content,
                name: req.body.name,
            }).then(function(comment){
                res.redirect('/posts/' + req.params.id);
            })
        })
    // db.comment.create({
    //     content: req.body.content,
    //     name: req.body.name,
    //     postId: req.body.postId
    // }).then(function(comment){
    //     res.redirect(`/posts/${req.body.postId}`);
    // })
})

module.exports = router;