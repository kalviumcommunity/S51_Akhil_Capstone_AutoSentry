import React, { useEffect, useState } from "react";
import Layout from "./Layout";
import "./TaskDashboard.css";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("High");
  const [selectedTask, setSelectedTask] = useState(null);
  const [dueDate, setDueDate] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleTextInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setSelectedPriority(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handleTaskDescriptionChange = (event) => {
    setTaskDescription(event.target.value);
  };

  const handleTaskSubmit = () => {
    if (textInput.trim() === "") {
      return;
    }

    const newTask = {
      text: textInput,
      priority: selectedPriority,
      dueDate: dueDate,
      description: taskDescription,
    };

    setTasks([...tasks, newTask]);
    setTextInput("");
    setSelectedPriority("High");
    setDueDate("");
    setTaskDescription("");
  };

  const getTasksByPriority = (priority) => {
    return tasks.filter((task) => task.priority === priority);
  };

  const handleEditTask = (editedText) => {
    const updatedTasks = tasks.map((task) =>
      task === selectedTask ? { ...task, text: editedText } : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  const handleChangePriority = (newPriority) => {
    const updatedTasks = tasks.map((task) =>
      task === selectedTask ? { ...task, priority: newPriority } : task
    );
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  const handleDeleteTask = () => {
    const updatedTasks = tasks.filter((task) => task !== selectedTask);
    setTasks(updatedTasks);
    setSelectedTask(null);
  };

  return (
    <div className="container">
        <h1>Add Maintenance Tasks</h1>
      <div className="task-input-section">
        <div className="task-input">
        <h4>Task:</h4>
          <input
            type="text"
            value={textInput}
            onChange={handleTextInputChange}
            className="input-field"
            placeholder="Enter task"
          />
        </div>
        <div className="priority-select">
        <h4>Priority:</h4>
          <select
            value={selectedPriority}
            onChange={handlePriorityChange}
            className="select-field"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
        <div className="date-input">
        <h4>Due Date:</h4>
          <input
            type="date"
            value={dueDate}
            onChange={handleDueDateChange}
            className="input-field"
            placeholder="Due Date"
          />
        </div>
        <div className="description-input">
        <h4>Task Description:</h4>
          <input
            type="text"
            value={taskDescription}
            onChange={handleTaskDescriptionChange}
            className="input-field"
            placeholder="Task Description"
          />
        </div>
        <button onClick={handleTaskSubmit} className="submit-button">
          Add Task
        </button>
      </div>
      <br/>
      <br/>
  
      <h2>Your Pending Maintenance Tasks</h2>
      <div className="task-list-section">
        <div className="task-list-grid">
          {/* High Priority */}
          <Layout
            getTasksByPriority={getTasksByPriority}
            setSelectedTask={setSelectedTask}
            selectedTask={selectedTask}
            handleEditTask={handleEditTask}
            handleChangePriority={handleChangePriority}
            handleDeleteTask={handleDeleteTask}
            level="High"
          />
          {/* Medium Priority */}
          <Layout
            getTasksByPriority={getTasksByPriority}
            setSelectedTask={setSelectedTask}
            selectedTask={selectedTask}
            handleEditTask={handleEditTask}
            handleChangePriority={handleChangePriority}
            handleDeleteTask={handleDeleteTask}
            level="Medium"
          />
          {/* Low Priority */}
          <Layout
            getTasksByPriority={getTasksByPriority}
            setSelectedTask={setSelectedTask}
            selectedTask={selectedTask}
            handleEditTask={handleEditTask}
            handleChangePriority={handleChangePriority}
            handleDeleteTask={handleDeleteTask}
            level="Low"
          />
        </div>
      </div>
    </div>
  );  
};

export default TaskDashboard;
