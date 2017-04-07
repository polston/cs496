const assert = require('assert')
const User = require('../models/userModel')
const mongoose = require('mongoose')
mongoose.Promise = global.Promise

describe('user model tests', function(done) {
    let user

    //create temporary user for tests
    beforeEach(function(done) {
        user = new User({
            name: {
                firstName: 'TestFirstName',
                lastName: 'TestLastName'
            },
            courses: ['ClassOne', 'ClassTwo', 'ClassThree'],
            permissions: 'Student'
        })
        user.save(function(err, doc) {
            if(err) { done(err) }
            assert(!user.isNew)
            done()
        })
    })

    it('should find a user by id in the database', function(done) {
        User.findById(user._id, function(err, doc) {
            if(err) { return console.log(err) }
            assert(user._id.toString() === doc._id.toString())
            done()
        })
    })

    it('should update a user\'s permissions in the database', function(done) {
        User.findByIdAndUpdate(user._id, {$set: {permissions: 'Tutor'}}, function(err, doc) {
            if(err) { return console.log(err) }
            User.findById(user._id, function(err, doc) {
                if(err) { return console.log(err) }
                assert(doc.permissions === 'Tutor')
                done()
            })
        })
    })

    //TODO: add delete and self-contained create

    //drop the test user after every test
    afterEach(function(done) {
        User.remove({_id: user._id}, function(err, doc) {
            if(err) { console.log(err) }
            done()
        })
    })
})