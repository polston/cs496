process.env.TEST = 'true'

const assert = require('assert')
const expect = require('chai').expect()
const should = require('chai').should()
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
    
    describe('finding users', function(done){
        it('should find a user by id in the database', function(done) {
            User.findById(user._id, function(err, doc) {
                if(err) { return console.log(err) }
                assert(user._id.toString() === doc._id.toString())
                done()
            })
        })
        
        //TODO: Find users by first name, last name, and appointment times 
    })
    
    describe('updating users', function(done) {
        it('should update a user\'s permissions in the database by id', function(done) {
            User.findByIdAndUpdate(user._id, {$set: {permissions: 'Tutor'}}, function(err, doc) {
                if(err) { return console.log(err) }
                User.findById(user._id, function(err, doc) {
                    if(err) { return console.log(err) }
                    assert(doc.permissions === 'Tutor')
                    done()
                })
            })
        })
        
        //TODO: update users first/last names, email(eventually), appointments(eventually),
        //TODO: creating tests verifying that updated fields are actually valid
    })
    
    describe('user deletion', function(done) {
        it('should delete a user by id in the database', function(done) {
            User.findByIdAndRemove(user._id, function(err, doc) {
                if(err) { return console.log(err) }
                User.findById(doc._id, function(err, doc) {
                    if(err) { return console.log(err) }
                    should.not.exist(doc)
                    done()
                })
            })
        })

    })

    // drop the test user after every test
    afterEach(function(done) {
        User.remove({_id: user._id}, function(err, doc) {
            if(err) { console.log(err) }
            done()
        })
    })
})