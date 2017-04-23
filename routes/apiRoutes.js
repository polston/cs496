const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const Appointment = require('../models/appointmentModel')

//TODO: add 404 handler for invalid id


// http://mongoosejs.com/docs/populate.html
// Including the above link for propserity, because eventually we will have to make it
// so that only certain fields are returned to the front end and not an entire document
// with all associated information

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

//get user by courses
router.get('/users/:courses', function(req, res, next){
  User.findById(req.params.id).then(function(user){
    res.json(user)
  })
})

//add new user to the database
router.post('/users', function(req, res, next){
  let user = new User(req.body)
  user.validate(function(error){
    if(error) {
      // res.json({error : error}) //sent back from post
      //printed to the server console
      if (error.name == 'ValidationError') {
        for (field in error.errors) {
            console.log(error.errors[field].message)
        }
      }
      res.json({error : error})
    }
    else {
      User.create(user).then(function(user){
        res.json(user)
      }).catch(next)
    }
  })
  // User.create(req.body).then(function(user){
  //   res.json(user)
  // }).catch(next)
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

//get all appointment
router.get('/calendar', function(req, res, next){
  Appointment.find({}).then(function(appointment){
    res.json(appointment)
  })
})

//get appointment by id
router.get('/calendar/:id', function(req, res, next){
  Appointment.findById(req.params.id).then(function(appointment){
    res.json(appointment)
  })
})

//add new appointment to the database
router.post('/calendar', function(req, res, next){
  
  let appointment = new Appointment(req.body)
  console.log('appointment: ', appointment)
  appointment.validate(function(error){
    if(error) {
      // res.json({error : error}) //sent back from post
      //printed to the server console
      if (error.name == 'ValidationError') {
        // for (field in error.errors) {
        //     console.log(error.errors[field].message)
        // }
        console.log('you fucked up')
      }
      res.json({error : error})
  }
})

  Appointment.create(req.body).then(function(appointment){
    console.log('\n\ncalendar post res: ' + JSON.stringify(req.body))
    res.json(appointment)
  }).catch(next, function(next){
    console.log('next' + next)
  })
})

//remove appointment from database
router.delete('/calendar/:id', function(req, res, next){
  Appointment.findByIdAndRemove(req.params.id).then(function(appointment){
    res.json(appointment)
  })
})

//update appointment in database
router.put('/calendar/:id', function(req, res, next){
  Appointment.findByIdAndUpdate(req.params.id, req.body).then(function(){
    Appointment.findById(req.params.id).then(function(appointment){
      //console.log('test' + user)
      res.json(appointment)
    })
  })
})

module.exports = router