import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  return (
    <nav>
      <ul>
        {role === 'principal' && (
          <>
            <li><h1>School Management system</h1></li>
          </>
        )}
        {role === 'teacher' && (
          <>
            <li><h1>School Management system</h1></li>
          </>
        )}
        {role === 'student' && (
          <li><h1>School Management system</h1></li>
        )}
        {localStorage.getItem('token')? 
        <li><button style={{marginTop:'18px'}} onClick={handleLogout}>Logout</button></li>:
        <li><h1>School Management system</h1></li>
        }
        
      </ul>
    </nav>
  );
}

export default Navbar;