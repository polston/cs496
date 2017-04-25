const express = require('express')
// const cookieParser = require('cookie-parser')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
// const User = require('../models/userModel')

  //there's definitely a better way to do '/' and '/index'

  // app.get('/', function(req, res){
  //   console.log(req.url);
  //   res.render('../views/index');
  // });

// router.get('/', function(req, res, next){
//   console.log(req.url);
//   // res.sendFile(__dirname+ '/public/js/index.js')
//   res.render('../views/landing');
// })
  
// router.get('/index', function(req, res, next){
//   // console.log(req.body);
//   res.render('../views/index');
// })
// a middleware function with no mount path. This code is executed for every request to the router
router.use(function (req, res, next) {
  // console.log('Time:', Date.now())
  next()
})

router.get('/', function(req, res, next){
  console.log('\n\nsessionID:\n', req.sessionID)
  if(req.user){
    console.log('\n\nreq.user:\n', req.user.permissions)
  }
  else{
    console.log('\n\nreq.user:\n', req.user)
  }
  // console.log('\n\nreq.user:\n', req.user.permissions)
  console.log('\n\nsigned cookie?:\n', req.signedCookies)
  console.log('\n\nsession.id?:\n', req.session.id)
  res.render('../views/index')
})


module.exports = router