
  //Line below this is needed for 401 errors in controllers.!! Don't delete!
  //res.status(401).render('../views/errors/401.ejs');

const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/userModel')


router.use(require('./permissionsMiddleware'))

router.route('/')
.get(function(req, res, next){
  res.render('../views/index')
})

module.exports = router