import './App.css';
import Login from './routes/login'
import Menu from './routes/menu'
import { AuthProvider } from './contexts/useAuth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/private_route';
import Register from './routes/register';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path='/login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/' element={<PrivateRoute><Menu/></PrivateRoute>} />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
