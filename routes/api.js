const express = require('express')
const router = express.Router()
const User = require('../models/user')


//get all users
router.get('/users', function(req, res, next){
  User.find({}).then(function(users){
    res.send(users)
  })
})

//get user by id
router.get('/users/:id', function(req, res, next){
  User.findById(req.params.id).then(function(user){
    res.send(user)
  })
})

//add new user to the database
router.post('/users', function(req, res, next){
  User.create(req.body).then(function(user){
    res.send(user)
  }).catch(next)
})

//remove user from database
router.delete('/users/:id', function(req, res, next){
  User.findByIdAndRemove(req.params.id).then(function(user){
    res.send(user)
  })
})

//update user in database
router.put('/users/:id', function(req, res, next){
  User.findByIdAndUpdate(req.params.id, req.body).then(function(){
    User.findById(req.params.id).then(function(user){
      //console.log('test' + user)
      res.send(user)
    })
  })
})

module.exports = router