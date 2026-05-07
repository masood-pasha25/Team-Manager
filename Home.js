import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="welcome-section">
        <h1>Welcome, {user?.first_name || user?.username}! 👋</h1>
        <p>Manage your projects and tasks efficiently</p>
      </div>

      <div className="home-grid">
        <div className="home-card" onClick={() => navigate('/projects')}>
          <div className="card-icon">📁</div>
          <h3>Projects</h3>
          <p>Create and manage your projects</p>
        </div>

        <div className="home-card" onClick={() => navigate('/my-tasks')}>
          <div className="card-icon">✓</div>
          <h3>My Tasks</h3>
          <p>View tasks assigned to you</p>
        </div>

        <div className="home-card" onClick={() => navigate('/projects')}>
          <div className="card-icon">👥</div>
          <h3>Team Collaboration</h3>
          <p>Work with your team members</p>
        </div>

        <div className="home-card" onClick={() => navigate('/projects')}>
          <div className="card-icon">📊</div>
          <h3>Dashboards</h3>
          <p>Track progress with insights</p>
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <ul className="features-list">
          <li>✨ Create projects and organize teams</li>
          <li>✨ Assign tasks with priorities and deadlines</li>
          <li>✨ Track task status in real-time</li>
          <li>✨ Role-based access control (Admin/Member)</li>
          <li>✨ Dashboard with task statistics</li>
          <li>✨ View overdue tasks at a glance</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
