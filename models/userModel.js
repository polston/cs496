const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const validPermissions = ['Admin', 'Supervisor', 'Tutor', 'Student']

const UserSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  google: {
    id: String, //google.id
    token: String,
    email: String,
    name: String,
    image: String
  },
  name: {
    firstName: {
      type: String,
      minlength: [1, 'First name must contain at least one character'],
      maxlength: [25, 'First name is too long.'],
      required: [true, 'First name required.'],
      trim: true
    },
    lastName: {
      type: String,
      minlength: [1, 'Last name must contain at least one character'],
      maxlength: [25, 'Last name is too long.'],
      required: [true, 'Last name required.'],
      trim: true
  }
},
  password: String, //this is only used by the testing environment
  courses: [String],
  permissions: {
    type: String, 
    default: 'Student', 
    trim: true, 
    required: true,
    validate: {
      validator: function(v) { 
        return validPermissions.indexOf(v) != -1 
      }, 
      message: "Invalid permissions"
    },
  }
})

// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password)
}

//for the testing suite...
UserSchema.methods.dummyPasswordChecker = function(){
  return true
}

const User = mongoose.model('user', UserSchema)

module.exports = User