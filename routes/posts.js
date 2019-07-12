const express = require('express');
const db = require('../models');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary');
const upload = multer({dest: './uploads'});
const isLoggedIn = require('../middleware/isLoggedIn')

// router.get('profile/users/:id', isLoggedIn, function(req, res) {
//     db.user.findOne({
//       where: {id: parseInt(req.params.id)},
//       include: [db.post]
//     }).then( function(user){
//     //   console.log(user)
//       db.post.findAll({
//           where: {
//               userId: user.id,
//           },
//           include : [db.comment]
//         }).then(function(pics) {
//         //   console.log(pics[0].comments);
//           res.render('profile', {user, pics });
//       })
//     })
//   });
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
          res.render('users/show', {user, pics });//!check this out i think this supposed to be pic not pics
      })
    })
  });


  router.delete('/users/:id', isLoggedIn, function(req, res) {
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
          res.redirect('/users');
      })
    })
  });

  // localhost 3000/posts/:id
  router.put('/users/:id', isLoggedIn, function(req, res) {
    db.user.findOne({
      where: {id:req.user.id},
      include: [db.post]
    }).then( function(user){
      // console.log("Hello user",user.id)
      db.post.update({
        caption: req.body.caption
      },{
      where:{
            id:req.params.id
            }
        }).then(function(pics) {
          res.redirect('/users/' + req.user.id);
      })
    })
  })

//   router.put('/posts/:id', isLoggedIn, function(req, res) {
//     db.user.findOne({
//       where: {id:req.user.id},
//       include: [db.post]
//     }).then( function(user){
//     //   console.log(user)
//       db.post.update({
          
//           where: {
//               id:req.params.id,
//               userId: user.id
//           }
//         }).then(function(pics) {
//           res.redirect('users/show');
//       })
//     })
//   });

//   app.put('/dinosaurs/:id', function(req, res){
//     // let dinosaurs = fs.readFileSync('./dinosaurs.json');
//     // let dinoData = JSON.parse(dinosaurs);
//     // var id = parseInt(req.params.id);
//     // dinoData[id].name = req.body.dinosaurName;
//     // dinoData[id].type = req.body.dinosaurType;
//     // fs.writeFileSync('./dinosaurs.json', JSON.stringify(dinoData));
//     db.parentdino.update({
//         name:req.body.dinosaurName,
//         type:req.body.dinosaurType
//     }, {
//         where:{id: parseInt(req.params.id)}
//     })
//     res.redirect("/dinosaurs/"+ id);
// })
  
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