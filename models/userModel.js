const mongoose = require('mongoose')
const Schema = mongoose.Schema

const validPermissions = ['Admin', 'Supervisor', 'Tutor', 'Student']

const UserSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  name: {
    firstName: {
      type: String,
      minlength: [1, 'Last name must contain at least one character'],
      maxlength: [25, 'Last name is too long.'],
      required: [true, 'First name requried.'],
    },
    lastName: {
      type: String,
      minlength: [1, 'First name must contain at least one character'],
      maxlength: [25, 'First name is too long.'],
      required: [true, 'Last name required.'],
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
})

const User = mongoose.model('user', UserSchema)

module.exports = User