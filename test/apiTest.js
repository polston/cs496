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
let agent = supertest.agent()
// api.use(cookieParser())
//const api = supertest(process.env.IP + ':'+ process.env.PORT + '/api')
let admin
let supervisor
let tutor
let student
let cookie


describe('api tests', function(done) {

    //create admin user for each test
    beforeEach(function(done) {
        // const api = supertest.agent(app)
        admin = new User({
            name: {
                firstName: 'TestAdminFirstName',
                lastName: 'TestAdminLastName'
            },
            // password: generateHash('testaroo'),
            courses: ['AdminClassOne', 'AdminClassTwo', 'AdminClassThree'],
            permissions: 'Admin',
            google: {
                id: 'testadminuserid', //google.id
                token: 'testadminusertoken',
                email: 'testadminuser@email.com',
                name: 'testAdminUserDisplayName'
            },
        })

        admin.password = admin.generateHash('admin')
        // console.log(user)
        admin.save(function(err, doc) {
            if(err) { done(err) }
            assert(!admin.isNew)
        })

        done()
    })

    describe('get routes', function(done) {
        it('should return a 200 response', function(done) {
            loginUser(admin, function(agent){
                agent.get('/api/users')
                    .expect(200)
                    .end(function(err, res) {
                        done()
                    })
            })
        })

        it('should return user object requested', function(done) {
            loginUser(admin, function(agent){
                agent.get('/api/users/'+admin._id)
                    .expect(200)
                    .end(function(err, res) {
                        should.not.exist(err)
                        should.exist(res)
                        res.should.be.an('object')
                        res.body.should.have.property('_id').eql(admin._id.toString())
                        done()
                    })
            })
        })
        
        it('should return all users', function(done) {
            loginUser(admin, function(agent){
                agent.get('/api/users')
                .expect(200)
                .end(function(err, res) {
                    should.not.exist(err)
                    should.exist(res)
                    res.body.should.be.an('array')
                    done()
                })
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
            loginUser(admin, function(agent){
                agent.post('/api/users')
                    .send(postUser)
                    .expect(200)
                    .end(function(err, res) {
                        res.body.should.be.an('object')
                        res.body.should.have.property('_id')
                        res.body.should.have.deep.property('name.firstName', 'PostTestUserFirstName')
                        res.body.should.have.deep.property('name.lastName', 'PostTestUserLastName')
                        User.remove({_id: res.body._id}, done)
                    })
            })
        })
    })

    describe('put routes', function(done) {
        //TODO: try with other permissions than admin
        it('should update all of a user\'s properties in database', function(done) {
            let putUser = {
                name: {
                    firstName: 'PutTestUserFirstName',
                    lastName: 'PutTestUserLastName'
                  },
                  courses: ['PutClass1', 'PutClass2', 'PutClass3'],
                  permissions: 'Tutor'
                }

            loginUser(admin, function(agent){
                let user = createUser('Student')
                agent.put('/api/users/'+user._id)
                    .send(putUser)
                    .expect(200)
                    .end(function(err, res) {
                        res.body.should.be.an('object')
                        res.body.should.have.property('_id').eql(user._id.toString())
                        res.body.should.have.deep.property('name.firstName', 'PutTestUserFirstName')
                        res.body.should.have.deep.property('name.lastName', 'PutTestUserLastName')
                        res.body.should.have.property('permissions', 'Tutor')
                        deleteUser(user._id)
                        done()
                    })
            })
            
        })
    })

    describe('delete routes', function(done) {
        it('delete user in database', function(done) {
            loginUser(admin, function(agent){
                let user = createUser('Student')
                agent.delete('/api/users/'+user._id)
                    .expect(200)
                    .end(function(err, res) {
                        res.body.should.be.an('object')
                        res.body.should.have.property('_id').eql(user._id.toString())
                        res.body.should.have.deep.property('name.firstName', user.name.firstName)
                        res.body.should.have.deep.property('name.lastName', user.name.lastName)
                        done(deleteUser(user._id))
                    })
            })
            
        })
    })

    //drop the admin test user after every test
    //probably better to just drop the whole collection
    afterEach(function(done) {
        User.remove({_id: admin._id}, function(err, doc) {
            if(err) { console.log(err) }
            done()
        })
    })
})

//logs in a user through the local passport strategy
function loginUser(loginInfo, done){
    let agent = supertest.agent(app)
    agent.post('/login')
        .set('Connection', 'keep-alive')
        .send({ '_id': loginInfo._id, 'password': loginInfo.password })
        .expect('Location', '/home')
        .end(function(err, req){
            if(err) return err
            done(agent)
        })
}

//used for making a temporary user in some tests
function createUser(permission){
    user = new User({
        name: {
            firstName: 'Test' + permission + 'FirstName',
            lastName: 'Test' + permission + 'LastName'
        },
        // password: generateHash('testaroo'),
        courses: [permission + 'ClassOne', permission + 'ClassTwo', permission + 'ClassThree'],
        permissions: permission,
        google: {
            id: 'test' + permission + 'userid', //google.id
            token: 'test' + permission + 'usertoken',
            email: 'test' + permission + 'user@email.com',
            name: 'test' + permission + 'UserDisplayName'
        },
    })
    let id = ''
    user.password = user.generateHash(permission)
    // console.log(user)
    user.save(function(err, doc) {
        assert(!user.isNew)
        // done()
    })
    return user
}

function deleteUser(id){
    User.findByIdAndRemove(id, function(err, doc) {
        if(err) { console.log(err) }
    })
}