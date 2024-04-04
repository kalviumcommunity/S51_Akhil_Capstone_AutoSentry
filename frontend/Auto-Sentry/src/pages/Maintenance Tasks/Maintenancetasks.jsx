import React from 'react';
import './Maintenancetasks.css'; // Import the CSS file

const Maintenancetasks = () => {
  // Sample maintenance tasks data (replace with actual data from state or props)
  const tasks = [
    { id: 1, name: 'Oil Change', dueDate: '2024-04-10' },
    { id: 2, name: 'Tire Rotation', dueDate: '2024-04-15' },
    { id: 3, name: 'Brake Inspection', dueDate: '2024-05-05' },
  ];

  return (
    <div className="task-list-container"> {/* Use the CSS class for the container */}
      <h1>Maintenance Tasks</h1>
      {tasks.map(task => (
        <div key={task.id} className="task-item"> {/* Use the CSS class for each task item */}
          <h3>{task.name}</h3>
          <p>Due Date: {task.dueDate}</p>
        </div>
      ))}
    </div>
  );
};

export default Maintenancetasks;