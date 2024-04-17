import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './TaskDashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const TaskDashboard = () => {
  const { user } = useAuth0();
  const [username, setUsername] = useState(user.nickname);
  const [task, setTask] = useState()
  const [priority, setPriority] = useState()
  const [dueDate, setDueDate] = useState()
  const [taskDescription, settaskDescription] = useState()

  const Submit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/tasks",{user: username,task,priority,dueDate,taskDescription})
    .then(result => {
      console.log(result)
      toast.success('Maintenance Task Created Successfully');
    })
    .catch(err => console.log(err))
  }

  return (
    <div className="parenttask">
      <h1 className='heading'>Your Maintenance Tasks</h1>
      <div className="task-dashboardpar">
        <h2 className='subheading'>New Task</h2> 
        <div className="task-dashboard">
          <form onSubmit={Submit}>
            <input
              name="task"
              type="text"
              placeholder="Task"
              onChange={(e) => setTask(e.target.value)}
              required
            />
            <select
              name="priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              name="dueDate"
              type="date"
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <textarea
              name="taskDescription"
              placeholder="Task Description"
              onChange={(e) => settaskDescription(e.target.value)}
              required
            />
            <button type="submit">Add Task+</button>
          </form>
          <ToastContainer />
        </div>
      </div>
      <div className='pendingblock'>
        <h2 className='pending'>Pending</h2>
        <div className='block'>
        <div className='highpriority'>High</div>
        <div className="midpriority">mid</div>
        <div className='lowpriority'>low</div>
        </div>

      </div>
    </div>
  );
};

export default TaskDashboard;
