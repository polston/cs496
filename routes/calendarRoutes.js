const express = require('express')
const passport = require('passport')
const router = express.Router()
// const User = require('../models/userModel')

router.use(require('./permissionsMiddleware'))

router.route('/')
.get(function(req, res, next){
  console.log(req.url);
  // res.sendFile('/public/js/calendarController.js')
  res.render('../views/calendar');
})

module.exports = router