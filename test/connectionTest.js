process.env.TEST = 'true'

// let mongoose = require('mongoose')
// let express = require('express')
// let app = require('../app')
// let conn


//let db = 'mongodb://localhost/cs496t'

    before(function(done){
        /*
        I don't think we actually need any of this anymore since the tests
        are set up to use environment variables now, but I'm going to keep this
        mess here until we actually figure out whether or not it's needed
        
        //if(mongoose.connect(db)) { return done() }
        //mongoose.connection.close()
        // conn = mongoose.connect(db)
        // //conn = mongoose.connection
        // conn.once('open', function(){
        //     console.log('Connection to test database established. ' + process.env.TEST)
            
        //     done()
        // }).on('error', function(error){
        //     console.log('Connection error: ', error)
        // })
        
        // let mongoose = require('mongoose')
        // let express = require('express')
        
        //let conn
        //app.listen(process.env.PORT || 4000, process.env.IP || 'localhost')
        // process.env.TEST = 'true'
        
        */
        
        process.env.TEST = 'true'
        let app = require('../app')
        done()
    })

    after(function(done){
        /*
        same deal here as above
        
        // console.log('db name: ' + conn.db.name)
        // conn.db.dropDatabase(function(){
        //     console.log('Disconnected from test database.')
        //     process.env.TEST = 'false'
        //     conn.close(done);
        // })
        // console.log('Disconnected from test database.')
        // conn.close(done);
        */
        
        process.env.TEST = 'false'
        done()
      })