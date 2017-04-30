const express = require('express')
const router = express.Router()
// const User = require('../models/userModel')
const Appointment = require('../models/appointmentModel')

router.use(require('./permissionsMiddleware'))

router.route('/')
.get(function(req, res, next){
  res.render('../views/appointments');
})

module.exports = router