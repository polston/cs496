const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')


router.use(require('./permissionsMiddleware'))


router.route('/')
.get(function(req, res, next){
  res.render('../views/profile')
})

module.exports = router