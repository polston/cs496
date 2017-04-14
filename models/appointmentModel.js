const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = require('./userModel')

const AppointmentSchema = new Schema({
  _id: { type: Schema.ObjectId, auto: true },
  date: {type: Date, required: true},
  tutor: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  student: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  course: {type: String, required: true},
  attendees: {type: Number, default: 1}
})

const Appointment = mongoose.model('appointment', AppointmentSchema)

module.exports = Appointment