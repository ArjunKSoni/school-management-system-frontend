import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentDashboard() {
  const [classroom, setClassroom] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    fetchClassroomAndClassmates();
    fetchTimetable();
  }, []);

  const fetchClassroomAndClassmates = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/classrooms/student', {
        headers: { 'x-auth-token': localStorage.getItem('token') }
      });
      setClassroom(response.data.classroom);
      setClassmates(response.data.classmates);
    } catch (error) {
      console.error('Error fetching classroom and classmates:', error);
    }
  };

  const fetchTimetable = async () => {
    if (classroom) {
      try {
        const response = await axios.get(`http://localhost:5000/api/timetables/classroom/${classroom._id}`, {
          headers: { 'x-auth-token': localStorage.getItem('token') }
        });
        setTimetable(response.data.periods);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    }
  };

  return (
    <div>
      <h1>Student Dashboard</h1>
      {classroom && <h2>Classroom: {classroom.name}</h2>}
      
      <h3>Classmates</h3>
      <ul>
        {classmates.map(classmate => (
          <li key={classmate._id}>{classmate.email}</li>
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
    </div>
  );
}

export default StudentDashboard;