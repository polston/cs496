let mongoose = require('mongoose')
let express = require('express')
let app = require('../app')
let server


let db = 'mongodb://localhost/cs496tests'

    before(function(done){
        //if(mongoose.connect(db)) { return done() }
        //mongoose.connect(db)
        mongoose.connection.once('open', function(){
            console.log('Connection to test database established.')

            if(!module.parent){
                server = app.listen(process.env.PORT || 4000, process.env.IP || 'localhost', done)
            }
            done()
        }).on('error', function(error){
            console.log('Connection error: ', error)
        })

    })

    // after(function () {
    //     mongoose.connection.close()
    //     server.close()
    // })

// describe('connection to database', function(done){



//     it('connect to the database', function(done){

// })