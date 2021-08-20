const { model, Schema } = require('mongoose')

const subjectSchema = new Schema({
  name: String,
  subjects: [String],
  students: {
    type: Schema.Types.ObjectId,
    ref: 'students',
  },
})

module.exports = model('Subject', subjectSchema)
