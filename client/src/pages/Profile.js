import React, { useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { AuthContext } from '../context/auth'
import moment from 'moment'

const Profile = () => {
  const { student } = useContext(AuthContext)
  console.log(student)
  student.date_of_birth = moment(student.date_of_birth).format('MM/DD/YYYY')
  console.log(student.date_of_birth)
  const [errors, setErrors] = useState({})
  const [values, setValues] = useState({
    name: student.name,
    email: student.email,
    phone: student.phone,
    date_of_birth: student.date_of_birth,
  })
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
  }

  return (
    <div className='container'>
      <Navbar />
      <form className='bg-light p-5 form-container mt-5' onSubmit={onSubmit}>
        <div className='d-flex justify-content-center'>
          <h2>Register</h2>
        </div>
        <div className='d-grid gap-3'>
          <div className='form-group'>
            <label htmlFor=''>Name</label>
            <input
              type='text'
              name='name'
              className='form-control'
              placeholder='Enter your name'
              value={values.name}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Email Address</label>
            <input
              type='email'
              name='email'
              className='form-control'
              placeholder='Enter your email address'
              value={values.email}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Phone</label>
            <input
              type='text'
              name='phone'
              className='form-control'
              placeholder='Enter your mobile number'
              value={values.phone}
              onChange={onChange}
              required
            />
          </div>
          <div className='form-group'>
            <label htmlFor=''>Date of Birth</label>
            <input
              type='date'
              name='date_of_birth'
              className='form-control'
              value={values.date_of_birth}
              onChange={onChange}
              required
            />
          </div>
          <button type='submit' className='btn btn-primary'>
            Update
          </button>
        </div>
        {Object.keys(errors).length > 0 && (
          <div>
            <ul>
              {Object.values(errors).map((value) => (
                <li className='text-danger pt-3' key={value}>
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  )
}

const REGISTER_STUDENT = gql`
  mutation createStudent(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $phone: String!
    $date_of_birth: Date!
  ) {
    createStudent(
      studentInput: {
        name: $name
        email: $email
        password: $password
        confirmPassword: $confirmPassword
        phone: $phone
        date_of_birth: $date_of_birth
      }
    ) {
      id
      name
      email
      phone
      date_of_birth
      token
    }
  }
`

export default Profile
