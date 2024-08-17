import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrincipalDashboard from './pages/PrincipalDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import Navbar from './components/Navbar';
import { isAuthenticated, getUserRole } from './utils/auth';

function PrivateRoute({ element: Element, allowedRoles, ...rest }) {
  return isAuthenticated() && allowedRoles.includes(getUserRole()) ? (
    <Element {...rest} />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/principal/*" 
          element={
            <PrivateRoute 
              element={PrincipalDashboard} 
              allowedRoles={['principal']} 
            />
          } 
        />
        <Route 
          path="/teacher/*" 
          element={
            <PrivateRoute 
              element={TeacherDashboard} 
              allowedRoles={['teacher']} 
            />
          } 
        />
        <Route 
          path="/student/*" 
          element={
            <PrivateRoute 
              element={StudentDashboard} 
              allowedRoles={['student']} 
            />
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;