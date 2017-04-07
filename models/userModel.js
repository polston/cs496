const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  name: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  courses: [String],
  permissions: {type: String, default: 'Student', required: true}
})

const User = mongoose.model('user', UserSchema)

module.exports = User