const express = require('express');
const db = require('../models');
const router = express.Router();

//* GET /users - returns all users
//! GET /users - returns all users
router.get('/', function(req, res){
    db.user.findAll().then(function(users){
        res.render('users/index', {users:users});
    });
})
//* GET /users/new - send a form for adding a new user
//! GET /users/new - send a form for adding a new user
router.get('/new', function(req, res){
    res.render('users/new');
})
//* POST /users - create a new user;
//! POST /users - create a new user;
    router.post('/', function(req, res){
        db.user.create({
            name:req.body.name,
            email:req.body.email,
            password: req.body.password
        }).then(function(data){
            res.redirect('/users');
        });
    })
//* GET /users/:id - returns the selected user
//! GET /users/:id - returns the selected user
router.get('/:id', function(req, res){
    db.user.findOne({
        where: {id:parseInt(req.params.id)},
        include: [db.post]
        })
        .then(function(user){
            res.render('users/show', {user: user});
        });
});

module.exports = router;