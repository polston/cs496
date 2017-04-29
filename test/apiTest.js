process.env.TEST = 'true'

//some of these imports may be unnecessary
const assert = require('assert')
const supertest = require('supertest')
const should = require('chai').should()
const expect = require('chai').expect()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const app = require('../app')
app.use(cookieParser())
mongoose.Promise = global.Promise

const User = require('../models/userModel')
// const api = supertest.agent(app)
// api.use(cookieParser())
//const api = supertest(process.env.IP + ':'+ process.env.PORT + '/api')
let user
let cookie





describe('api tests', function(done) {
    // const api = supertest.agent(app)

    it('login user', loginUser())

    //create temporary user for each test
    beforeEach(function(done) {
        api = supertest.agent(app)
        user = new User({
            name: {
                firstName: 'TestFirstName',
                lastName: 'TestLastName'
            },
            courses: ['ClassOne', 'ClassTwo', 'ClassThree'],
            permissions: 'Student',
            google: {
                id: 'testuserid', //google.id
                token: 'testusertoken',
                email: 'testuser@email.com',
                name: 'testUserDisplayName'
            },
        })
        user.save(function(err, doc) {
            if(err) { done(err) }
            assert(!user.isNew)
            // loginUser()
            // done()
        })
        loginUser()
        done()
    })

    describe('get routes', function(done) {
        // it('should test some shit', function(done){
        //     api.get('/api/users', function(req, res){
        //         console.log('\n\ncookies?:' + res.cookies)
        //     })
        // })

        it('should return a 200 response', function(done) {
            loginUser()
            api.get('/api/users')
            // .send({permissions: 'Admin'})
            // .set('Cookie', cookie)
            .set('Connection', 'keep-alive')
            .expect(200)
            .end(function(err, res) {
                console.log('\n\ncookies?:' + JSON.stringify(res, null, 2))
                if(err) { console.log('Error: ' + err) }
                done()
            })
        })

        it('should return user object requested', function(done) {
            api.get('/api/users/'+user._id)
            .expect(200)
            .end(function(err, res) {
                if(err) { console.log('Error: ' + err) }
                should.not.exist(err)
                should.exist(res)
                res.should.be.an('object')
                res.body.should.have.property('_id').eql(user._id.toString())
                done()
            })
        })

        it('should return all users', function(done) {
            api.get('/api/users')
            .expect(200)
            .end(function(err, res) {
                if(err) { console.log('Error: ' + err) }
                should.not.exist(err)
                should.exist(res)
                res.body.should.be.an('array')
                //res.body.should.have.property('_id').eql(user._id.toString())
                done()
            })
        })

    })

    describe('post routes', function(done) {
        it('should post new user to database', function(done) {
            let postUser = {
                name: {
                    firstName: 'PostTestUserFirstName',
                    lastName: 'PostTestUserLastName'
                  },
                  courses: ['PostClass1', 'PostClass2', 'PostClass3'],
                  permissions: 'Student'
                }

            api.post('/api/users')
            .send(postUser)
            .expect(200)
            .end(function(err, res) {
                if(err) { console.log('Error: ' + err) }
                res.body.should.be.an('object')
                res.body.should.have.property('_id')
                res.body.should.have.deep.property('name.firstName', 'PostTestUserFirstName')
                res.body.should.have.deep.property('name.lastName', 'PostTestUserLastName')
                User.remove({_id: res.body._id}, done)
            })
        })
    })

    describe('put routes', function(done) {
        it('should update all of a user\'s properties in database', function(done) {
            let putUser = {
                name: {
                    firstName: 'PutTestUserFirstName',
                    lastName: 'PutTestUserLastName'
                  },
                  courses: ['PutClass1', 'PutClass2', 'PutClass3'],
                  permissions: 'Tutor'
                }

            api.put('/api/users/'+user._id)
            .send(putUser)
            .expect(200)
            .end(function(err, res) {
                if(err) { console.log('Error: ' + err) }
                res.body.should.be.an('object')
                res.body.should.have.property('_id').eql(user._id.toString())
                res.body.should.have.deep.property('name.firstName', 'PutTestUserFirstName')
                res.body.should.have.deep.property('name.lastName', 'PutTestUserLastName')
                res.body.should.have.property('permissions', 'Tutor')
                done()
            })
        })
    })

    describe('delete routes', function(done) {
        it('delete user in database', function(done) {
            api.delete('/api/users/'+user._id)
            .expect(200)
            .end(function(err, res) {
                if(err) { console.log('Error: ' + err) }
                res.body.should.be.an('object')
                res.body.should.have.property('_id').eql(user._id.toString())
                res.body.should.have.deep.property('name.firstName', 'TestFirstName')
                res.body.should.have.deep.property('name.lastName', 'TestLastName')
                done()
            })
        })
    })

    //drop the test user after every test
    afterEach(function(done) {
        User.remove({_id: user._id}, function(err, doc) {
            if(err) { console.log(err) }
            done()
        })
    })

    function loginUser(){
    return function(done){
        api.post('/login')
            
            .set('Connection', 'keep-alive')
            .expect(302)
            .send({'user.name.firstName': user.name.firstName}, {'user.name.lastName': user.name.lastName})
            // .expect('set-cookie', '/connect.sid/')
            // .expect(Headers())
            // .expect('Location', '/home')
            .end(function(err, res){
                if(err) return err
                console.log('\n\nres?: ' + JSON.stringify(res, null, 2))
                done()
            })
        
        // function onAuth(err, req, res){
        //     console.log('\n\nprint you fuck: ' + JSON.stringify(req, null, 2))
        //     console.log('\n\nprint you fuck: ' + JSON.stringify(res.header, null, 2))
        //     console.log('\n\nasdfsdf: ' + req.cookie)
        //     // console.log('\n\nprint you fuck: ' + JSON.stringify(req, null, 2))
        //     if(err) throw err
        //     // api.saveCookies(req)
        //     cookie = req.headers['set-cookie']
        //     console.log('cookie: ' + cookie)
        //     return done()
        // }
    }
}
})