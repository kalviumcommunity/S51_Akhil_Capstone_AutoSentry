import React from "react";
import './Action.css'; // Import the CSS file

const Action = (props) => {
  return (
    <div className="action-container">
      <button
        className="action-button"
        onClick={() =>
          props.handleEditTask(
            prompt("Edit task:", props.selectedTask.text),
            prompt("Edit due date:", props.selectedTask.dueDate),
            prompt("Edit description:", props.selectedTask.description)
          )
        }
      >
        Edit
      </button>
      <button
        className="action-button"
        onClick={() =>
          props.handleChangePriority(
            prompt("Enter new priority:", props.selectedTask.priority)
          )
        }
      >
        Change Priority
      </button>
      <button
        className="action-button"
        onClick={() => {
          window.alert(
            `Are you sure you want to delete the task with priority ${props.priority}?`
          );
          props.handleDeleteTask();
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default Action;
