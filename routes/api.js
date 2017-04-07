const express = require('express')
const router = express.Router()
const User = require('../models/userModel')

//TODO: add 404 handler for invalid id

//get all users
router.get('/users', function(req, res, next){
  User.find({}).then(function(users){
    res.json(users)
  })
})

//get user by id
router.get('/users/:id', function(req, res, next){
  User.findById(req.params.id).then(function(user){
    res.json(user)
  })
})

//add new user to the database
router.post('/users', function(req, res, next){
  User.create(req.body).then(function(user){
    res.json(user)
  }).catch(next)
})

//remove user from database
router.delete('/users/:id', function(req, res, next){
  User.findByIdAndRemove(req.params.id).then(function(user){
    res.json(user)
  })
})

//update user in database
router.put('/users/:id', function(req, res, next){
  User.findByIdAndUpdate(req.params.id, req.body).then(function(){
    User.findById(req.params.id).then(function(user){
      //console.log('test' + user)
      res.json(user)
    })
  })
})

module.exports = router