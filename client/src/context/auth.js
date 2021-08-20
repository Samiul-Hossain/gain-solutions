import React, { useReducer, createContext } from 'react'
import jwtDecode from 'jwt-decode'

const initialState = {
  student: null,
}

if (localStorage.getItem('token')) {
  const decodedToken = jwtDecode(localStorage.getItem('token'))

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('token')
  } else {
    initialState.student = decodedToken
  }
}

const AuthContext = createContext({
  student: null,
  login: (studentData) => {},
  logout: () => {},
})

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        student: action.payload,
      }
    case 'LOGOUT':
      return {
        ...state,
        student: null,
      }
    default:
      return state
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  function login(studentData) {
    localStorage.setItem('token', studentData.token)
    dispatch({
      type: 'LOGIN',
      payload: studentData,
    })
  }

  function logout() {
    localStorage.removeItem('token')
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider
      value={{ student: state.student, login, logout }}
      {...props}
    />
  )
}

export { AuthContext, AuthProvider }
