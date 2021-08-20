const studentsResolvers = require('./students')
const subjectsResolvers = require('./subjects')

module.exports = {
  Query: {
    ...studentsResolvers.Query,
  },
}
