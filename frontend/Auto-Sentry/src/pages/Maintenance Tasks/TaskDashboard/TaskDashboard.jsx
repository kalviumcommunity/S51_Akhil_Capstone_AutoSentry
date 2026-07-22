import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { toast } from 'react-toastify';
import { BsCheckCircleFill } from 'react-icons/bs';
import { FaCalendarPlus, FaPlus, FaClipboardList, FaCheckCircle } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { NavLink, useParams } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './TaskDashboard.css';

const PRIORITY_META = {
  High:   { label: 'High',   className: 'priority-high',   dot: '#ef4444' },
  Medium: { label: 'Medium', className: 'priority-medium', dot: '#f59e0b' },
  Low:    { label: 'Low',    className: 'priority-low',    dot: '#22c55e' },
};

const TaskDashboard = () => {
  const { vehicleId } = useParams();
  const { user, isAuthenticated } = useAuth0();

  const [task, setTask]                       = useState('');
  const [priority, setPriority]               = useState('');
  const [dueDate, setDueDate]                 = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [tasks, setTasks]                     = useState([]);
  const [activeTab, setActiveTab]             = useState('upcoming');
  const [error, setError]                     = useState(null);
  const [submitting, setSubmitting]           = useState(false);
  const [deleteId, setDeleteId]               = useState(null);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/api/tasks/byVehicle/${vehicleId}`);
      setTasks(res.data);
      setError(null);
    } catch {
      setError('Failed to load tasks. Please try again.');
    }
  };

  useEffect(() => {
    if (isAuthenticated && user?.nickname) fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post('/api/tasks', {
        user: user.nickname,
        vehicleId,
        task,
        priority,
        dueDate,
        taskDescription,
        taskStatus: false,
      });
      toast.success('Task added successfully');
      fetchTasks();
      setTask(''); setPriority(''); setDueDate(''); setTaskDescription('');
    } catch {
      toast.error('Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  const handleComplete = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { taskStatus: true });
      setTasks(prev => prev.map(t => t._id === taskId ? { ...t, taskStatus: true } : t));
      toast.success('Task marked as complete');
    } catch {
      toast.error('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete task');
    }
  };

  const upcoming  = tasks.filter(t => !t.taskStatus);
  const completed = tasks.filter(t =>  t.taskStatus);
  const displayed = activeTab === 'upcoming' ? upcoming : completed;

  const isOverdue = (dateStr) => new Date(dateStr) < new Date() && new Date(dateStr).toDateString() !== new Date().toDateString();

  if (!isAuthenticated) return null;

  return (
    <div className="td-page">

      {/* ── PAGE HEADER ── */}
      <div className="td-header">
        <div className="td-header-inner">
          <div>
            <span className="td-eyebrow">Vehicle Maintenance</span>
            <h1 className="td-title">Maintenance Tasks</h1>
            <p className="td-subtitle">
              {upcoming.length} upcoming · {completed.length} completed
            </p>
          </div>
          <NavLink to="/garage" className="td-back-btn">← Back to Garage</NavLink>
        </div>
      </div>

      <div className="td-body">

        {/* ── STATS ROW ── */}
        <div className="td-stats">
          {[
            { label: 'Total Tasks',  value: tasks.length,     color: '#0a2640' },
            { label: 'Upcoming',     value: upcoming.length,  color: '#f59e0b' },
            { label: 'Completed',    value: completed.length, color: '#22c55e' },
            { label: 'Overdue',      value: upcoming.filter(t => isOverdue(t.dueDate)).length, color: '#ef4444' },
          ].map(s => (
            <div className="td-stat-card" key={s.label}>
              <span className="td-stat-num" style={{ color: s.color }}>{s.value}</span>
              <span className="td-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── CREATE TASK FORM ── */}
        <div className="td-form-card">
          <div className="td-form-card-header">
            <FaPlus className="td-form-icon" />
            <h2>Create New Task</h2>
          </div>
          <form onSubmit={handleSubmit} className="td-form">
            <div className="td-form-row">
              <div className="td-field">
                <label htmlFor="task-name">Task Name</label>
                <input
                  id="task-name"
                  type="text"
                  placeholder="e.g. Oil Change"
                  value={task}
                  onChange={e => setTask(e.target.value)}
                  required
                />
              </div>
              <div className="td-field">
                <label htmlFor="task-priority">Priority</label>
                <select
                  id="task-priority"
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  required
                >
                  <option value="">Select priority</option>
                  <option value="High">🔴 High</option>
                  <option value="Medium">🟡 Medium</option>
                  <option value="Low">🟢 Low</option>
                </select>
              </div>
              <div className="td-field">
                <label htmlFor="task-due">Due Date</label>
                <input
                  id="task-due"
                  type="date"
                  value={dueDate}
                  onChange={e => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="td-form-row">
              <div className="td-field td-field--grow">
                <label htmlFor="task-desc">Description</label>
                <textarea
                  id="task-desc"
                  placeholder="Describe what needs to be done…"
                  value={taskDescription}
                  onChange={e => setTaskDescription(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="td-submit-wrap">
                <button type="submit" className="td-submit-btn" disabled={submitting}>
                  {submitting ? 'Adding…' : <><FaPlus /> Add Task</>}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* ── TASK LIST ── */}
        <div className="td-list-card">
          {/* Tabs */}
          <div className="td-tabs">
            <button
              className={`td-tab${activeTab === 'upcoming' ? ' td-tab--active' : ''}`}
              onClick={() => setActiveTab('upcoming')}
            >
              <FaClipboardList /> Upcoming
              {upcoming.length > 0 && <span className="td-tab-badge">{upcoming.length}</span>}
            </button>
            <button
              className={`td-tab${activeTab === 'completed' ? ' td-tab--active' : ''}`}
              onClick={() => setActiveTab('completed')}
            >
              <FaCheckCircle /> Completed
              {completed.length > 0 && <span className="td-tab-badge td-tab-badge--green">{completed.length}</span>}
            </button>
          </div>

          {/* Error */}
          {error && <p className="td-error" role="alert">{error}</p>}

          {/* Empty state */}
          {displayed.length === 0 && (
            <div className="td-empty">
              {activeTab === 'upcoming'
                ? <><FaClipboardList className="td-empty-icon" /><p>No upcoming tasks — add one above.</p></>
                : <><FaCheckCircle  className="td-empty-icon" /><p>No completed tasks yet.</p></>
              }
            </div>
          )}

          {/* Task rows */}
          <div className="td-task-list">
            {displayed.map((t) => {
              const meta    = PRIORITY_META[t.priority] || {};
              const overdue = activeTab === 'upcoming' && isOverdue(t.dueDate);
              return (
                <div key={t._id} className={`td-task${overdue ? ' td-task--overdue' : ''}${t.taskStatus ? ' td-task--done' : ''}`}>

                  {/* Priority dot */}
                  <span className="td-priority-dot" style={{ background: meta.dot }} title={t.priority} />

                  {/* Main info */}
                  <div className="td-task-main">
                    <div className="td-task-top">
                      <span className="td-task-name">{t.task}</span>
                      <span className={`td-priority-badge ${meta.className}`}>{t.priority}</span>
                      {overdue && <span className="td-overdue-badge">Overdue</span>}
                      {t.taskStatus && <span className="td-done-badge">Done</span>}
                    </div>
                    {t.taskDescription && (
                      <p className="td-task-desc">{t.taskDescription}</p>
                    )}
                    <div className="td-task-meta">
                      <span className="td-task-date">
                        📅 {new Date(t.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="td-task-actions">
                    {!t.taskStatus && (
                      <>
                        <NavLink
                          to={`/Googlecalender?task=${encodeURIComponent(t.task)}&date=${t.dueDate}`}
                          className="td-action-btn td-action-btn--cal"
                          title="Add to Google Calendar"
                        >
                          <FaCalendarPlus size={15} />
                        </NavLink>
                        <button
                          className="td-action-btn td-action-btn--complete"
                          title="Mark complete"
                          onClick={() => handleComplete(t._id)}
                        >
                          <BsCheckCircleFill size={15} />
                        </button>
                      </>
                    )}
                    <button
                      className="td-action-btn td-action-btn--delete"
                      title="Delete task"
                      onClick={() => setDeleteId(t._id)}
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteId && (
        <div className="td-modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="td-modal" onClick={e => e.stopPropagation()}>
            <h3>Delete task?</h3>
            <p>This will permanently remove the task. This cannot be undone.</p>
            <div className="td-modal-actions">
              <button className="td-modal-btn td-modal-btn--cancel" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="td-modal-btn td-modal-btn--confirm" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDashboard;
