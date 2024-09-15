
import './App.css'
import { BrowserRouter as Router ,Routes,Route } from 'react-router-dom'
import { SignUpComponent } from './components/sign-up'
import { LoginComponent } from './components/login'

function App() {

  return (
      <Router>
        
        <div >
      <Routes>
        <Route path="/"></Route>
        <Route path='/signup' Component={SignUpComponent}/>
        <Route path='/login' Component={LoginComponent}/>
      </Routes>
        </div>

        
      </Router>
  )
}

export default App
