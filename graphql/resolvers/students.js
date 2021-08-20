const Student = require('../../models/Student')
const { GraphQLScalarType, Kind } = require('graphql')
const dayjs = require('dayjs')

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return dayjs(value).format('DD-MM-YYYY') // Convert outgoing Date to integer for JSON
  },
  parseValue(value) {
    return dayjs(value) // Convert incoming integer to Date
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return dayjs(ast.value) // Convert hard-coded AST string to integer and then to Date
    }
    return null // Invalid hard-coded value (not an integer)
  },
})

module.exports = {
  Date: dateScalar,
  Query: {
    async getStudents() {
      try {
        const students = await Student.find()
        return students
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}
