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

router.route('/users')
//returns json of all users based on logged on user's permissions
.get(function(req, res, next){
  // console.log(req.session.views)
  //if the logged in user is an admin
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
router.route('/users/:courses')
.get(function(req, res, next){
  User.findById(req.params.id).then(function(user){
    res.json(user)
  })
})
// ../users/:courses

//get all appointments
router.route('/calendar')
.get(function(req, res, next){
  //admins and supervisors can see all appointments
  if(req.user.permissions == 'Admin' || req.user.permissions == 'Supervisor'){
    Appointment.find({}).then(function(appointments){
      res.json(appointments)
    })
  }


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