import React from 'react'
import * as firebase from 'firebase'

const Dashboard = () => (
  <div>
    <h1>{`hello ${firebase.auth().currentUser.email}`}</h1>
  </div>
)

export default Dashboard
