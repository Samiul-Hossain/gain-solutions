import React, { useState, useContext } from 'react'
import Navbar from '../components/Navbar'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/react-hooks'
import { AuthContext } from '../context/auth'

const Login = () => {
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  const onChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const [logStudent, { loading }] = useMutation(LOGIN_STUDENT, {
    update(proxy, result) {
      context.login(result.data.login)
      //localStorage.setItem('token', result.data.login.token)
      //window.location.assign('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.errors)
    },
    variables: values,
  })

  const onSubmit = async (e) => {
    e.preventDefault()
    logStudent()
  }
  return (
    <div className='container'>
      <Navbar />
      <form className='bg-light p-5 form-container mt-5' onSubmit={onSubmit}>
        <div className='d-flex justify-content-center'>
          <h2>Login</h2>
        </div>
        <div className='d-grid gap-3'>
          <div className='form-group'>
            <label htmlFor=''>Email</label>
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
            <label htmlFor=''>Password</label>
            <input
              type='password'
              name='password'
              className='form-control'
              placeholder='Enter your password'
              value={values.password}
              onChange={onChange}
              required
            />
          </div>
          <button type='submit' className='btn btn-primary'>
            submit
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

const LOGIN_STUDENT = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      id
      name
      email
      phone
      date_of_birth
      token
    }
  }
`

export default Login
