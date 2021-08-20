const { gql } = require('apollo-server')

module.exports = gql`
  scalar Date
  type Student {
    id: ID!
    name: String!
    email: String!
    phone: String!
    date_of_birth: Date!
  }
  type Query {
    getStudents: [Student]
  }
`
