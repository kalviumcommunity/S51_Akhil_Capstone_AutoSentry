import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { ToastContainer, toast } from 'react-toastify';
import { BsCheckCircleFill } from "react-icons/bs";
import { FaCalendarPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { NavLink } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './TaskDashboard.css';

const TaskDashboard = () => {
  const { user, isAuthenticated } = useAuth0();
  const [username, setUsername] = useState(user ? user.nickname : '');
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskStatus, setTaskStatus] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [displayCompleted, setDisplayCompleted] = useState(false);
  const [isUpcomingSelected, setIsUpcomingSelected] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user && user.nickname) {
      setUsername(user.nickname);
      fetchTasks();
    }
  }, [isAuthenticated, user]);

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
      taskDescription,
      taskStatus
    })
    .then(result => {
      console.log(result);
      toast.success('Maintenance Task Created Successfully');
      fetchTasks();
      setTask('');
      setPriority('');
      setDueDate('');
      setTaskDescription('');
      setTaskStatus(false);
    })
    .catch(err => console.log(err))
  };

  const handleTaskStatusChange = async (taskId) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, {
        taskStatus: true
      });
      location.reload();
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const upcomingTasks = tasks.filter(task => !task.taskStatus);
  const completedTasks = tasks.filter(task => task.taskStatus);

  return (
    isAuthenticated && (
      <div className="parenttask">
        <h1 className="heading">Maintenance Tasks</h1>
        <div className="task-dashboardpar">
          <h2 className="subheading">Create Task</h2>
          <div className="task-dashboard">
            <form onSubmit={handleSubmit}>
              <input
                name="task"
                type="text"
                placeholder="Task"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="taskinput001"
                required
              />
              <textarea
                name="taskDescription"
                placeholder="Task Description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="taskdescription"
                required
              />
              <select
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="taskpriority"
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
                placeholder="Due Date"
                onChange={(e) => setDueDate(e.target.value)}
                className="taskduedate"
                required
              />
              <button type="submit" className="tasksubmitbtn">
                Add Task
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
        <div className="pendingblock">
          <div className="tasksaction">
            <button
              onClick={() => {
                setDisplayCompleted(false);
                setIsUpcomingSelected(true);
              }}
              className={isUpcomingSelected ? "selected" : ""}
            >
              Upcoming
            </button>
            <button
              onClick={() => {
                setDisplayCompleted(true);
                setIsUpcomingSelected(false);
              }}
              className={!isUpcomingSelected ? "selected" : ""}
            >
              Completed
            </button>
          </div>
          <div className="taskslist">
            {displayCompleted ? (
              <div>
                {completedTasks.map((task, index) => (
                  <div key={index} className="task">
                    <div className="tasktaskdiv">
                      <p>{task.task}</p>
                    </div>
                    <div className="taskdescriptiondiv">
                      <p>{task.taskDescription}</p>
                    </div>
                    <div className="taskprioritydiv">
                      <p>{task.priority}</p>
                    </div>
                    <div className="taskduedatediv">
                      <p>
                        {new Date(task.dueDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    <div className="delbtn" onClick={() => handleDeleteTask(task._id)}>
                      <MdDelete size={20}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                {upcomingTasks.map((task, index) => (
                  <div key={index} className={`task priority${task.priority}`}>
                    <div className={`tasktaskdiv priority${task.priority}`}>
                      <p>{task.task}</p>
                    </div>
                    <div
                      className={`taskdescriptiondiv priority${task.priority}`}
                    >
                      <p>{task.taskDescription}</p>
                    </div>
                    <div className={`taskprioritydiv priority${task.priority}`}>
                      <p>{task.priority}</p>
                    </div>
                    <div className={`taskduedatediv priority${task.priority}`}>
                      <p>
                        {new Date(task.dueDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                    {!task.taskStatus && (
                      <div className="taskactionsbtns">
                        <NavLink to={`/Googlecalender`}>
                          <FaCalendarPlus color="#000000" size={20} />
                        </NavLink>
                        <button
                          onClick={() => handleTaskStatusChange(task._id)}
                        >
                          <BsCheckCircleFill color="#000000" size={20} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default TaskDashboard;
