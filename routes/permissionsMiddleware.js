const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')

// const paths = ['/calendar', '/home', '/appointments', '/index']

router.use(function (req, res, next) {
  if(req.isAuthenticated()){
    return next()
  }
  else{
    res.redirect('/')
  }
})

module.exports = router