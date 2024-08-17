import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PrincipalDashboard() {
  const [users, setUsers] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'teacher' });
  const [newClassroom, setNewClassroom] = useState({ name: '', startTime: '', endTime: '', days: [] });
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedClassroom, setSelectedClassroom] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchClassrooms();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classrooms', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setClassrooms(response.data);
    } catch (error) {
      console.error('Error fetching classrooms:', error);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users/register', newUser, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setNewUser({ email: '', password: '', role: 'teacher' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleCreateClassroom = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/classrooms', newClassroom, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setNewClassroom({ name: '', startTime: '', endTime: '', days: [] });
      fetchClassrooms();
    } catch (error) {
      console.error('Error creating classroom:', error);
    }
  };

  const handleAssignTeacher = async () => {
    try {
      await axios.put(`http://localhost:5000/api/classrooms/${selectedClassroom}/assign-teacher`, 
        { teacherId: selectedTeacher },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      fetchClassrooms();
      setSelectedTeacher('');
      setSelectedClassroom('');
    } catch (error) {
      console.error('Error assigning teacher:', error);
    }
  };

  const handleAssignStudent = async () => {
    try {
      await axios.put(`http://localhost:5000/api/classrooms/${selectedClassroom}/assign-student`, 
        { studentId: selectedStudent },
        { headers: { 'x-auth-token': localStorage.getItem('token') } }
      );
      fetchClassrooms();
      setSelectedStudent('');
      setSelectedClassroom('');
    } catch (error) {
      console.error('Error assigning student:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteClassroom = async (classroomId) => {
    try {
      await axios.delete(`http://localhost:5000/api/classrooms/${classroomId}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      fetchClassrooms();
    } catch (error) {
      console.error('Error deleting classroom:', error);
    }
  };

  return (
    <div className="principal-dashboard">
      <h1>Principal Dashboard</h1>
      
      <section>
        <h2>Create User</h2>
        <form onSubmit={handleCreateUser}>
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            required
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            required
          >
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
          <button type="submit">Create User</button>
        </form>
      </section>

      <section>
        <h2>Create Classroom</h2>
        <form onSubmit={handleCreateClassroom}>
          <input
            type="text"
            placeholder="Classroom Name"
            value={newClassroom.name}
            onChange={(e) => setNewClassroom({ ...newClassroom, name: e.target.value })}
            required
          />
          <input
            type="time"
            placeholder="Start Time"
            value={newClassroom.startTime}
            onChange={(e) => setNewClassroom({ ...newClassroom, startTime: e.target.value })}
            required
          />
          <input
            type="time"
            placeholder="End Time"
            value={newClassroom.endTime}
            onChange={(e) => setNewClassroom({ ...newClassroom, endTime: e.target.value })}
            required
          />
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <label key={day}>
              <input
                type="checkbox"
                value={day}
                checked={newClassroom.days.includes(day)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setNewClassroom({ ...newClassroom, days: [...newClassroom.days, day] });
                  } else {
                    setNewClassroom({
                      ...newClassroom,
                      days: newClassroom.days.filter((d) => d !== day)
                    });
                  }
                }}
              />
              {day}
            </label>
          ))}
          <button type="submit">Create Classroom</button>
        </form>
      </section>

      <section>
        <h2>Assign Teacher to Classroom</h2>
        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
        >
          <option value="">Select Teacher</option>
          {users.filter(user => user.role === 'teacher').map(teacher => (
            <option key={teacher._id} value={teacher._id}>{teacher.email}</option>
          ))}
        </select>
        <select
          value={selectedClassroom}
          onChange={(e) => setSelectedClassroom(e.target.value)}
        >
          <option value="">Select Classroom</option>
          {classrooms.map(classroom => (
            <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
          ))}
        </select>
        <button onClick={handleAssignTeacher}>Assign Teacher</button>
      </section>

      <section>
        <h2>Assign Student to Classroom</h2>
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="">Select Student</option>
          {users.filter(user => user.role === 'student').map(student => (
            <option key={student._id} value={student._id}>{student.email}</option>
          ))}
        </select>
        <select
          value={selectedClassroom}
          onChange={(e) => setSelectedClassroom(e.target.value)}
        >
          <option value="">Select Classroom</option>
          {classrooms.map(classroom => (
            <option key={classroom._id} value={classroom._id}>{classroom.name}</option>
          ))}
        </select>
        <button onClick={handleAssignStudent}>Assign Student</button>
      </section>

      <section>
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>Classrooms</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Teacher</th>
              <th>Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classrooms.map(classroom => (
              <tr key={classroom._id}>
                <td>{classroom.name}</td>
                <td>{classroom.teacher ? classroom.teacher.email : 'Unassigned'}</td>
                <td>{classroom.students ? classroom.students.length : 0}</td>
                <td>
                  <button onClick={() => handleDeleteClassroom(classroom._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default PrincipalDashboard;