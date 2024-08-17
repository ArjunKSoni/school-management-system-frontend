import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TeacherDashboard() {
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [newPeriod, setNewPeriod] = useState({ subject: '', startTime: '', endTime: '', day: 'Monday' });

  useEffect(() => {
    fetchClassroomAndStudents();
    fetchTimetable();
  }, []);

  const fetchClassroomAndStudents = async () => {
    try {
      const response = await axios.get('https://school-management-system-pied-seven.vercel.app/api/classrooms/teacher', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setClassroom(response.data);
      setStudents(response.data.students);
    } catch (error) {
      console.error('Error fetching classroom and students:', error);
    }
  };

  const fetchTimetable = async () => {
    try {
      const response = await axios.get(`https://school-management-system-pied-seven.vercel.app/api/timetables/classroom/${classroom._id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setTimetable(response.data.periods);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };

  const handleAddPeriod = async (e) => {
    e.preventDefault();
    try {
      await axios.post('https://school-management-system-pied-seven.vercel.app/api/timetables', {
        classroom: classroom._id,
        periods: [...timetable, newPeriod]
      }, {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setNewPeriod({ subject: '', startTime: '', endTime: '', day: 'Monday' });
      fetchTimetable();
    } catch (error) {
      console.error('Error adding period:', error);
    }
  };

  return (
    <div>
      <h1>Teacher Dashboard</h1>
      {classroom && <h2>Classroom: {classroom.name}</h2>}
      
      <h3>Students</h3>
      <ul>
        {students.map(student => (
          <li key={student._id}>{student.email}</li>
        ))}
      </ul>

      <h3>Timetable</h3>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Subject</th>
            <th>Start Time</th>
            <th>End Time</th>
          </tr>
        </thead>
        <tbody>
          {timetable.map((period, index) => (
            <tr key={index}>
              <td>{period.day}</td>
              <td>{period.subject}</td>
              <td>{period.startTime}</td>
              <td>{period.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add Period</h3>
      <form onSubmit={handleAddPeriod}>
        <input
          type="text"
          placeholder="Subject"
          value={newPeriod.subject}
          onChange={(e) => setNewPeriod({ ...newPeriod, subject: e.target.value })}
          required
        />
        <input
          type="time"
          value={newPeriod.startTime}
          onChange={(e) => setNewPeriod({ ...newPeriod, startTime: e.target.value })}
          required
        />
        <input
          type="time"
          value={newPeriod.endTime}
          onChange={(e) => setNewPeriod({ ...newPeriod, endTime: e.target.value })}
          required
        />
        <select
          value={newPeriod.day}
          onChange={(e) => setNewPeriod({ ...newPeriod, day: e.target.value })}
          required
        >
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <button type="submit">Add Period</button>
      </form>
    </div>
  );
}

export default TeacherDashboard;