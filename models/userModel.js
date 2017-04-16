const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validPermissions = ['Admin', 'Supervisor', 'Tutor', 'Student']

const UserSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  google: {
    id: String, //google.id
    token: String,
    email: String,
    name: String
  },
  name: {
    firstName: {
      type: String,
      minlength: [1, 'Last name must contain at least one character'],
      maxlength: [25, 'Last name is too long.'],
      // required: [true, 'First name requried.'],
    },
    lastName: {
      type: String,
      minlength: [1, 'First name must contain at least one character'],
      maxlength: [25, 'First name is too long.']
      // required: [true, 'Last name required.'],
  }
},
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

    //austin's branch is here, validators will be missing
    //until we resolve how to use them with the oauth routing
  //   firstName: String,// firstName: {type: String, required: true},
  //   lastName: String// lastName: {type: String, required: true}
  // },
  // courses: [String],
  // permissions: {type: String, default: 'Student', required: true},
  // email: String// email: {type: String, required: true}
})

const User = mongoose.model('user', UserSchema)

module.exports = User