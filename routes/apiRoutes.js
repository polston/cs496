const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const Appointment = require('../models/appointmentModel')

//TODO: add 404 handler for invalid id/course


// http://mongoosejs.com/docs/populate.html
// Including the above link for propserity, because eventually we will have to make it
// so that only certain fields are returned to the front end and not an entire document
// with all associated information

// function 

//get all users
//TODO: probably a way to put it all in a promise and return the correct thing
// in the end, instead of just checking permissions and doing a seperate query in each

// if(process.env.TEST == 'true'){
//   router.use(function(req, res, next){
//     req.session.permissions = 'Admin'
//     res.session.permissions = 'Admin'
//     console.log('router: ' + req.user)
//     next()
//   })
// }

router.route('/users')
//returns json of all users based on logged on user's permissions
.get(function(req, res, next){
  // console.log(req.session.views)
  //if the logged in user is an admin
  console.log('\n\nres: ' + JSON.stringify(req.body, null, 2))
  if(req.user.permissions == 'Admin'){
    User.find({}).then(function(users){
      res.json(users)
      // found = JSON.parse()
    })
  }
  //if the logged in user is a supervisor
  else if(req.user.permissions == 'Supervisor'){
    User.find({permissions: 'Student', permissions: 'Tutor'}).then(function(users){
      res.json(users)
      // found = users
    })
  }
  //if the logged in user is a student or tutor
  else if(req.user.permissions == 'Student' || req.user.permissions == 'Tutor'){
    User.find({permissions: 'Tutor'}).then(function(users){
      res.json(users)
    })
  }
})

.post(function(req, res, next){
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
      //only admins and supervisors can create users
      if(req.user.permissions == 'Admin' || req.user.permissions == 'Supervisor'){
        //only admins can create admins
        if(user.permissions == 'Admin' && req.user.permissions == 'Admin'){
          User.create(user).then(function(user){
            res.json(user)
          }).catch(next)
        }
        //supervisors can create anything but admins
        else if(user.permissions != 'Admin'){
          User.create(user).then(function(user){
            res.json(user)
          }).catch(next)
        }
      }
    }
  })
})
// ../users

router.route('/users/:id')
//get user by id
//TODO: not really sure if this should be restricted by permissions?
.get(function(req, res, next){
  User.findById(req.params.id).then(function(user){
    res.json(user)
  })
})
//remove user from database
.delete(function(req, res, next){
  //admins can remove anyone
  if(req.user.permissions == 'Admin'){
    User.findByIdAndRemove(req.params.id).then(function(user){
      res.json(user)
    })
  }
  //supervisors can't remove admins or other supervisors
  else if(req.user.permissions == 'Supervisor'){
    User.findById(req.params.id).then(function(user){
      if(user.permissions != 'Admin' && user.permissions != 'Supervisor'){
        User.findByIdAndRemove(req.params.id).then(function(user){
          res.json(user)
        })
      }
    })
  }
  
})
//update user in database
.put(function(req, res, next){
  //admins can update anyone
  if(req.user.permissions == 'Admin'){
    User.findByIdAndUpdate(req.params.id, req.body).then(function(){
      User.findById(req.params.id).then(function(user){
        //console.log('test' + user)
        res.json(user)
      })
    })
  }
  //supervisors can't update admins or other supervisors
  else if(req.user.permissions == 'Supervisor'){
    User.findById(req.params.id).then(function(user){
      if(user.permissions != 'Admin' && user.permissions != 'Supervisor'){
        User.findById(req.params.id).then(function(user){
          //console.log('test' + user)
          res.json(user)
        })
      }
    })
  }
  //users can update themselves? This probably works?
  //TODO: write tests for this specifically...
  else if(req.user._id === req.params.id){
    User.findByIdAndUpdate(req.params.id, req.body).then(function(){
      User.findById(req.params.id).then(function(user){
        //console.log('test' + user)
        res.json(user)
      })
    })
  }
})
// ../users/:id

//get user by courses
//TODO: does this need permission restrictions?
router.route('/users/:courses')
.get(function(req, res, next){
  User.findById(req.params.id).then(function(user){
    res.json(user)
  })
})
// ../users/:courses

//get all appointments based on user id and permissions
router.route('/calendar')
.get(function(req, res, next){
  //admins and supervisors can see all appointments
  if(req.user.permissions == 'Admin' || req.user.permissions == 'Supervisor'){
    Appointment.find({}).then(function(appointments){
      res.json(appointments)
    })
  }
  //these two below could be reconciled into one, but I'm going to leave it like this for readability
  // tutors can see available tutors, and their own appointments
  else if(req.user.permissions == 'Tutor'){
    Appointment.find({student: {"$exists": false}, tutor: req.user._id}).then(function(appointments){
      res.json(appointments)
    })
  }
  //students can see available tutors and their own appointments
  else if(req.user.permissions == 'Student'){
    Appointment.find({student: {"$exists": false}, student: req.user._id}).then(function(appointments){
      res.json(appointments)
    })
  }
})
//add new appointment to the database
.post(function(req, res, next){
  let appointment = new Appointment(req.body)
  console.log('appointment: ', appointment)
  //error handling inside model
  appointment.validate(function(error){
    if(error) {
      res.json({error : error}) //sent back from post
      //printed to the server console
      if (error.name == 'ValidationError') {
        for (field in error.errors) {
            console.log(error.errors[field].message)
        }
      }
      res.json({error : error})
    }
  })
  //TODO: can tutors make their own appointments?
  //admins and supervisors can create appointments
  if(req.user.permissions == 'Admin' || req.user.permissions == 'Supervisor'){
    Appointment.create(req.body).then(function(appointment){
      console.log('\n\ncalendar post res: ' + JSON.stringify(req.body))
      res.json(appointment)
    }).catch(next, function(next){
      console.log('next: ' + next)
    })
  }
  
})

router.route('/calendar/:id')
//get specific appointment by its id and user permissions
.get(function(req, res, next){
  //admins can get any appointment
  if(req.user.permissions == 'Admin' || req.user.permissions == 'Supervisor'){
    Appointment.findById(req.params.id).then(function(appointment){
      res.json(appointment)
    })
  }
  //tutors can only get their own appointments, and those that are available
  else if(req.user.permissions == 'Tutor'){
    Appointment.findById(req.params.id).then(function(appointment){
      //FIXME: this may or may not work
      if(appointment.tutor === req.user._id || !appointment.hasOwnProperty('student')){
        res.json(appointment)
      }
    })
  }
  //students can only get their own appointments, and those that are available
  else if(req.user.permissions == 'Student'){
    Appointment.findById(req.params.id).then(function(appointment){
      //FIXME: this may or may not work
      if(appointment.student === req.user._id || !appointment.hasOwnProperty('student')){
        res.json(appointment)
      }
    })
  }
})
//remove appointment from database based on user permissions
.delete(function(req, res, next){
  //only admins and supervisors can remove appointments
  if(req.user.permissions == 'Admin' || req.user.permissions == 'Supervisor'){
    Appointment.findByIdAndRemove(req.params.id).then(function(appointment){
      res.json(appointment)
    })
  }
})
.put(function(req, res, next){
  //admins and supervisors can update any appointment
  if(req.user.permissions == 'Admin' || req.user.permissions == 'Supervisor'){
    Appointment.findByIdAndUpdate(req.params.id, req.body).then(function(){
      Appointment.findById(req.params.id).then(function(appointment){
        //console.log('test' + user)
        res.json(appointment)
      })
    })
  }
  //TODO: does this even work?
  //students can only update the student field of an appointment
  else if(req.user.permissions == 'Student' || req.user.permissions == 'Tutor'){
    Appointment.findByIdAndUpdate(req.params.id, {student: req.user._id}).then(function(){
      Appointment.findById(req.params.id).then(function(appointment){
        //console.log('test' + user)
        res.json(appointment)
      })
    })
  }
})

module.exports = router