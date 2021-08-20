import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import PieComponent from '../components/PieComponent'

const Home = () => {
  const [studentData, setStudentData] = useState([])
  const { loading, data } = useQuery(FETCH_STUDENTS)

  useEffect(() => {
    try {
      if (data) {
        const { getStudents: students } = data
        setStudentData(students)
      } else {
        console.error('No data')
      }
    } catch (err) {
      console.log(err)
    }
  }, [data])
  return (
    <div className='container'>
      <Navbar />
      <h2>Dashboard</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of Birth</th>
            <th>Subjects</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td>Loading Students</td>
            </tr>
          ) : (
            studentData &&
            studentData.map((student) => (
              <tr key={student.id}>
                <td className='col-xl-3'>{student.name}</td>
                <td className='col-xl-3'>{student.email}</td>
                <td className='col-xl-3'>{student.phone}</td>
                <td className='col-xl-3'>{student.date_of_birth}</td>
                <td className='col-xl-3'></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <PieComponent />
    </div>
  )
}

const FETCH_STUDENTS = gql`
  {
    getStudents {
      id
      name
      phone
      email
      date_of_birth
    }
  }
`

const FETCH_SUBJECT = gql`
  query ($studentId: ID!) {
    getSubject(studentId: $studentId) {
      name
      subjects
    }
  }
`

export default Home
