import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('/')}>
          📋 Team Task Manager
        </div>
        <ul className="nav-menu">
          <li><a href="/" className="nav-link">Dashboard</a></li>
          <li><a href="/projects" className="nav-link">Projects</a></li>
          <li><a href="/my-tasks" className="nav-link">My Tasks</a></li>
        </ul>
        <div className="nav-user">
          <span className="user-name">{user.username}</span>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
