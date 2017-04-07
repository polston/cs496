
let db = ''
console.log(process.env.TEST)
if(process.env.TEST === 'true') { 
    console.log('using test db')
    exports.db = 'mongodb://localhost/cs496t' 
}
else { exports.db = 'mongodb://localhost/cs496' }