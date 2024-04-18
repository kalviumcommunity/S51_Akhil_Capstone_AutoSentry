import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import './TaskDashboard.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../Layout/Layout'; 

const TaskDashboard = () => {
  const { user } = useAuth0();
  const [username, setUsername] = useState(user.nickname);
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/api/tasks", {
      user: username,
      task,
      priority,
      dueDate,
      taskDescription
    })
    .then(result => {
      console.log(result);
      toast.success('Maintenance Task Created Successfully');
      fetchTasks();
      setTask('');
      setPriority('');
      setDueDate('');
      setTaskDescription('');
    })
    .catch(err => console.log(err))
  }

  const handleUpdateTask = (taskId, updatedTask) => {
    axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedTask)
      .then(result => {
        console.log(result);
        toast.success('Maintenance Task Updated Successfully');
        fetchTasks();
      })
      .catch(err => console.log(err))
  };

  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:5000/api/tasks/${taskId}`)
      .then(result => {
        console.log(result);
        toast.success('Maintenance Task Deleted Successfully');
        fetchTasks();
      })
      .catch(err => console.log(err))
  };

  return (
    <div className="parenttask">
      <h1 className='heading'>Your Maintenance Tasks</h1>
      <div className="task-dashboardpar">
        <h2 className='subheading'>New Task</h2> 
        <div className="task-dashboard">
        <form onSubmit={handleSubmit}>
            <input
              name="task"
              type="text"
              placeholder="Task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              required
            />
            <select
              name="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              name="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            <textarea
              name="taskDescription"
              placeholder="Task Description"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              required
            />
            <button type="submit">Add Task+</button>
          </form>
          <ToastContainer />
        </div>
      </div>
      <div className='pendingblock'>
        <h2 className='pending'>Pending Task</h2>
        <div className='block'>
          <div className='highpriority'>
            <Layout
              level="High"
              tasks={tasks.filter(task => task.priority === 'High')}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
          <div className="midpriority">
            <Layout
              level="Medium"
              tasks={tasks.filter(task => task.priority === 'Medium')}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
          <div className='lowpriority'>
            <Layout
              level="Low"
              tasks={tasks.filter(task => task.priority === 'Low')}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDashboard;
