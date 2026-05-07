import React, { useEffect, useState } from 'react';
import { taskAPI } from '../services/api';
import './MyTasks.css';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadMyTasks();
  }, []);

  const loadMyTasks = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getMyTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Find the project ID for this task
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        await taskAPI.updateTaskStatus(task.project_id, taskId, newStatus);
        loadMyTasks();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update task');
    }
  };

  const filteredTasks = filterStatus === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filterStatus);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-tasks-container">
      <h1>My Tasks</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-buttons">
        <button
          className={filterStatus === 'all' ? 'active' : ''}
          onClick={() => setFilterStatus('all')}
        >
          All ({tasks.length})
        </button>
        <button
          className={filterStatus === 'todo' ? 'active' : ''}
          onClick={() => setFilterStatus('todo')}
        >
          To Do ({tasks.filter(t => t.status === 'todo').length})
        </button>
        <button
          className={filterStatus === 'in_progress' ? 'active' : ''}
          onClick={() => setFilterStatus('in_progress')}
        >
          In Progress ({tasks.filter(t => t.status === 'in_progress').length})
        </button>
        <button
          className={filterStatus === 'completed' ? 'active' : ''}
          onClick={() => setFilterStatus('completed')}
        >
          Completed ({tasks.filter(t => t.status === 'completed').length})
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="no-tasks">No tasks assigned to you</div>
      ) : (
        <div className="tasks-container">
          {filteredTasks.map((task) => (
            <div key={task.id} className={`task-card status-${task.status}`}>
              <div className="task-card-header">
                <h3>{task.title}</h3>
                <span className={`priority priority-${task.priority}`}>{task.priority}</span>
              </div>

              <p className="task-description">{task.description}</p>

              <div className="task-info">
                <span className="project-name">📁 {task.project_name}</span>
                {task.due_date && (
                  <span className="due-date">📅 {new Date(task.due_date).toLocaleDateString()}</span>
                )}
              </div>

              <div className="task-actions">
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  className="status-select"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
