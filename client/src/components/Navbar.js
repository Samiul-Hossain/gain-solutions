import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'

const Navbar = () => {
  const { student, logout } = useContext(AuthContext)
  return (
    <div>
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <div className='container'>
          <div className='d-flex'>
            <Link className='px-3 text-info text-decoration-none' to='/'>
              Home
            </Link>
          </div>
          {student ? (
            <div className='d-flex'>
              <Link
                className='px-3 text-info text-decoration-none'
                to='/profile'
              >
                {student.name}
              </Link>
              <Link
                className='px-3 text-info text-decoration-none'
                to='/'
                onClick={logout}
              >
                logout
              </Link>
            </div>
          ) : (
            <div className='d-flex'>
              <Link className='px-3 text-info text-decoration-none' to='/login'>
                Login
              </Link>
              <Link
                className='px-3 text-info text-decoration-none'
                to='/register'
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

export default Navbar
