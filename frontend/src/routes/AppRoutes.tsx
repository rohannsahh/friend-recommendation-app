import { BrowserRouter as Router ,Routes,Route, Navigate } from 'react-router-dom'
import { SignUpComponent } from '../components/sign-up'
import { LoginComponent } from '../components/login'
import ProtectedRoute from './ProtectedRoute';
import Dashboard from '@/components/Dashboard';

const AppRoutes = () => {
  return (
    <Router>
       
      <Routes>
        <Route path="/" element={
            <ProtectedRoute>
                <Dashboard/>
                </ProtectedRoute>}>
                </Route>
        <Route path='/signup' element={<SignUpComponent/>}/>
        <Route path='/login' element={<LoginComponent/>}/>
        <Route path='*' element={<Navigate to ='/login'/>}></Route>
      </Routes>

        
      </Router>
  )
}

export default AppRoutes
