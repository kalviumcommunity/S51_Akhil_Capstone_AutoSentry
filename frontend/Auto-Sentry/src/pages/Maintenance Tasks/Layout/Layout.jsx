import React, { useState, useEffect } from "react";
import Action from "../Action/Action";
import './Layout.css'; 

function Layout(props) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const filteredTasks = tasks.filter(task => task.priority === props.level);

  return (
    <div className="layout-container">
      <h2 className="layout-title">
        {props.level} Priority
      </h2>
      {filteredTasks.map((task, index) => (
        <div key={index} className="task-container">
          <p
            className="task-details"
            onClick={() => props.setSelectedTask(task)}
          >
            <strong>{task.task}</strong>
            <br />
            <span>Due Date: {task.dueDate}</span>
            <br />
            <span>Description: {task.taskDescription}</span>
          </p>
          {props.selectedTask === task && (
            <>
              <Action
                priority={props.level}
                handleEditTask={props.handleEditTask}
                handleChangePriority={props.handleChangePriority}
                handleDeleteTask={props.handleDeleteTask}
                selectedTask={props.selectedTask}
              />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Layout;
