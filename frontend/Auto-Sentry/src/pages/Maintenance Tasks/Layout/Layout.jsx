import React from "react";
import Action from "../Action/Action";
import './Layout.css'; 

function Layout(props) {
  return (
    <div className="layout-container">
      <h2 className="layout-title">
        {props.level} Priority
      </h2>
      {props.getTasksByPriority(props.level).map((task, index) => (
        <div key={index} className="task-container">
          <p
            className="task-details"
            onClick={() => props.setSelectedTask(task)}
          >
            <strong>{task.text}</strong>
            <br />
            <span>Due Date: {task.dueDate}</span>
            <br />
            <span>Description: {task.description}</span>
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
