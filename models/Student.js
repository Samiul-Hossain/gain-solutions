const { model, Schema } = require('mongoose')

const studentSchema = new Schema({
  name: String,
  password: String,
  email: String,
  phone: String,
  date_of_birth: Date,
})

module.exports = model('Student', studentSchema)
