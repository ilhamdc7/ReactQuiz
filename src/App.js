import React from 'react'
import './App.css'
import Questions from '../src/Components/Questions'
import Main from '../src/Components/Main'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";





const App = () => {
  return (
        <div>
          <Router>
            <Route path="/competition" render={() => (
              <Questions/>
            )}/>
            <Route path="/" exact>
              <Main/>
              </Route>  
            
          </Router>
        </div>
 
    
  )
}

export default App
