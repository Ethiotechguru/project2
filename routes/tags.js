const express = require('express');
const router = express.Router();
const db = require('../models');


//*GET /tags - index - show all the tags

//* POST /tags - post them
router.post('/', function(req, res){
    db.post.findByPk(parseInt(req.body.postId)).then(function(post){
        db.tag.findOrCreate({
            where: {
                name: req.body.name
            }
        }).spread(function(tag, created){
            post.addTag(tag).then(function(tag){
                console.log(`${tag} added to ${post}`);
                res.redirect('/posts/' + req.body.postId);
            })
        })
    })
})

//* GET /tags/:id - show one tags and it  associated post

module.exports = router;