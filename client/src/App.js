import React, { useContext } from 'react'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import './App.css'
import { Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { AuthProvider } from './context/auth'
import AuthRoute from './util/AuthRoute'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route path='/profile'>
          {localStorage.getItem('token') ? (
            <Profile />
          ) : (
            <Redirect to='/login' />
          )}
        </Route>
        <AuthRoute exact path='/register' component={Register} />
        <AuthRoute exact path='/login' component={Login} />
      </Router>
    </AuthProvider>
  )
}

export default App
