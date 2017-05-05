process.env.TEST = 'true'

const assert = require('assert')
const expect = require('chai').expect()
const should = require('chai').should()
const User = require('../models/appointmentModel')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise


describe('user model tests', function(done) {
    let appointment

    //create temporary appointment for tests
    beforeEach(function(done) {
        appointment = new Appointment({
          //fill in appointment stuff
        })
        appointment.save(function(err, doc) {
            if(err) { done(err) }
            assert(!appointment.isNew)
            done()
        })
    })

})