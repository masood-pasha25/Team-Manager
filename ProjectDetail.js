import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectAPI, taskAPI } from '../services/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const [projectRes, dashboardRes] = await Promise.all([
        projectAPI.getProject(projectId),
        taskAPI.getDashboard(projectId)
      ]);
      
      setProject(projectRes.data);
      setTasks(dashboardRes.data.allTasks);
      setStats(dashboardRes.data.stats);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Project not found</div>;

  return (
    <div className="project-detail">
      <button className="back-btn" onClick={() => navigate('/projects')}>← Back to Projects</button>
      
      <div className="project-header">
        <h1>{project.name}</h1>
        <p>{project.description || 'No description'}</p>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Tasks</h3>
          <p className="stat-value">{stats?.total_tasks || 0}</p>
        </div>
        <div className="stat-card">
          <h3>To Do</h3>
          <p className="stat-value">{stats?.todo_count || 0}</p>
        </div>
        <div className="stat-card">
          <h3>In Progress</h3>
          <p className="stat-value">{stats?.in_progress_count || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Completed</h3>
          <p className="stat-value">{stats?.completed_count || 0}</p>
        </div>
        <div className="stat-card overdue">
          <h3>Overdue</h3>
          <p className="stat-value">{stats?.overdue_count || 0}</p>
        </div>
      </div>

      <div className="tasks-section">
        <h2>Tasks</h2>
        {tasks.length === 0 ? (
          <p className="no-tasks">No tasks yet. Click "New Project" to add one.</p>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <div key={task.id} className={`task-item status-${task.status}`}>
                <div className="task-content">
                  <h3>{task.title}</h3>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-meta">
                    <span className={`priority priority-${task.priority}`}>{task.priority}</span>
                    <span className="status">{task.status}</span>
                    {task.due_date && <span className="due-date">Due: {new Date(task.due_date).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
