const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')
// process.env. = require('../env.config')['process.env.dev']
if(process.env.dev != 'true'){ //skip over if in development environment
  router.use(function (req, res, next) {
    if(req.isAuthenticated()){
      return next()
    }
    else{
      res.status(401).render('../views/errors/401.ejs');
    }
  })
}
module.exports = router