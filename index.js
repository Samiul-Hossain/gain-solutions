const mongoose = require('mongoose')
const dotenv = require('dotenv')
const { ApolloServer, AuthenticationError } = require('apollo-server')
const gql = require('graphql-tag')
const { GraphQLScalarType, Kind } = require('graphql')
const dayjs = require('dayjs')
const { UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const Subject = require('./models/Subject')
const Student = require('./models/Student')
const {
  validateStudentInput,
  validateLoginInput,
} = require('./util/validators')
const checkAuth = require('./util/checkAuth')

// const typeDefs = require('./graphql/typeDefs')
// const resolvers = require('./graphql/resolvers/index')

dotenv.config()

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value) {
    return dayjs(value).format('MM-DD-YYYY') // Convert outgoing Date to integer for JSON
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

const typeDefs = gql`
  scalar Date
  type Pie {
    bangla: Int!
    english: Int!
    physics: Int!
    maths: Int!
  }
  type Student {
    id: ID!
    name: String!
    email: String!
    token: String!
    phone: String!
    date_of_birth: Date!
  }
  type Subject {
    id: ID!
    name: String!
    students: ID!
    subjects: [String]!
  }
  input StudentInput {
    name: String!
    email: String!
    password: String!
    confirmPassword: String!
    phone: String!
    date_of_birth: Date!
  }
  input SubjectInput {
    subjects: [String]!
  }
  type Query {
    getStudents: [Student]
    getStudent(studentId: ID!): Student
    getSubject(studentId: ID!): Subject
    getSubjects: [Subject]
    getSubjectsPie: Pie
  }
  type Mutation {
    createStudent(studentInput: StudentInput): Student!
    login(email: String!, password: String!): Student!
    deleteStudent(studentId: ID!): String!
    addSubject(subjectInput: SubjectInput): Subject!
  }
`
const generateToken = (student) => {
  return jwt.sign(
    {
      id: student.id,
      email: student.email,
      name: student.name,
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  )
}

const resolvers = {
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
    async getStudent(_, { studentId }) {
      try {
        const student = await Student.findById(studentId)
        if (student) {
          return student
        } else {
          throw new Error('Post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    async getSubject(_, { studentId }) {
      try {
        const subject = await Subject.findOne({
          students: studentId,
        })
        console.log(subject)
        if (subject) {
          return subject
        } else {
          throw new Error('Subjects not found')
        }
      } catch (err) {
        console.log(err)
      }
    },
    async getSubjects() {
      try {
        const subjects = await Subject.find({}, '-_id')
          .populate({ path: 'students', model: Student, select: '-_id' })
          .exec()
        console.log(subjects)
        return subjects
      } catch (err) {
        console.log(err)
      }
    },
    async getSubjectsPie() {
      const bangla = await Subject.find({ subjects: 'Bangla' }).count()
      const english = await Subject.find({ subjects: 'English' }).count()
      const physics = await Subject.find({ subjects: 'Physics' }).count()
      const maths = await Subject.find({ subjects: 'Maths' }).count()
      const pie = {
        bangla: bangla,
        english: english,
        physics: physics,
        maths: maths,
      }
      return pie
    },
  },
  Mutation: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password)
      if (!valid) throw new UserInputError('Errors', { errors })
      const student = await Student.findOne({ email })
      if (!student) {
        errors.general = 'Student not found'
        throw new UserInputError('Student not found', { errors })
      } else {
        const match = await bcrypt.compare(password, student.password)
        if (!match) {
          errors.general = 'Wrong credentials'
          throw new UserInputError('Wrong credentials', { errors })
        }
      }

      const token = generateToken(student)

      return { ...student._doc, id: student._id, token }
    },
    async createStudent(
      _,
      {
        studentInput: {
          name,
          email,
          password,
          confirmPassword,
          phone,
          date_of_birth,
        },
      }
    ) {
      //validate data
      const { valid, errors } = validateStudentInput(
        name,
        email,
        password,
        confirmPassword,
        phone,
        date_of_birth
      )
      if (!valid) throw new UserInputError('Errors', { errors })

      const stud = await Student.findOne({ email })

      if (stud) {
        throw new UserInputError('Email is taken', {
          errors: {
            email: 'This email is taken',
          },
        })
      }

      password = await bcrypt.hash(password, 12)

      const newStudent = new Student({
        name,
        email,
        password,
        phone,
        date_of_birth,
      })

      const res = await newStudent.save()

      const token = generateToken(res)

      return { ...res._doc, id: res._id, token }
    },
    async addSubject(_, { subjectInput: { subjects } }, context) {
      const student = checkAuth(context)
      console.log(student)

      const newSubj = new Subject({
        students: student.id,
        name: student.name,
        subjects,
      })
      const subject = await newSubj.save()
      return subject
    },
    async deleteStudent(_, { studentId }, context) {
      const student = checkAuth(context)

      try {
        const stud = await Student.findById(studentId)
        if (stud.email === student.email) {
          await stud.delete()
          return 'Student deleted successfully'
        } else {
          throw new AuthenticationError('Action not allowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
})

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }).then(() => {
  return server.listen({ port: 5000 }).then((res) => {
    console.log('MongoDB connected')
    console.log(`Server running at ${res.url}`)
  })
})
