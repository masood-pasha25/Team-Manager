import {
  createTask,
  getTaskById,
  getProjectTasks,
  getUserTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getDashboardStats,
  getProjectById,
  isTeamMember
} from '../models/index.js';
import { validationResult } from 'express-validator';

export const createNewTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { title, description, assignedTo, priority, dueDate } = req.body;

    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user has permission
    const isMember = await isTeamMember(projectId, req.user.id);
    if (project.admin_id !== req.user.id && !isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const task = await createTask(projectId, title, description, assignedTo, priority, dueDate, req.user.id);

    res.status(201).json({
      success: true,
      task: task
    });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permission
    const isMember = await isTeamMember(task.project_id, req.user.id);
    const project = await getProjectById(task.project_id);
    if (project.admin_id !== req.user.id && !isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const getProjectTasksList = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = await isTeamMember(projectId, req.user.id);
    if (project.admin_id !== req.user.id && !isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const tasks = await getProjectTasks(projectId);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getMyTasksList = async (req, res, next) => {
  try {
    const tasks = await getUserTasks(req.user.id);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const updateTaskDetails = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId } = req.params;
    const { title, description, assignedTo, status, priority, dueDate } = req.body;

    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Check permission
    const project = await getProjectById(task.project_id);
    if (project.admin_id !== req.user.id && req.user.id !== task.created_by) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedTask = await updateTask(taskId, title, description, assignedTo, status, priority, dueDate);

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask_Status = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!['todo', 'in_progress', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const task = await getTaskById(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Allow assigned user or task creator or project admin to update status
    const project = await getProjectById(task.project_id);
    const isAssigned = task.assigned_to === req.user.id;
    if (!isAssigned && project.admin_id !== req.user.id && req.user.id !== task.created_by) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedTask = await updateTaskStatus(taskId, status);

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await getTaskById(taskId);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only creator or project admin can delete
    const project = await getProjectById(task.project_id);
    if (project.admin_id !== req.user.id && req.user.id !== task.created_by) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await deleteTask(taskId);

    res.json({
      success: true,
      message: 'Task deleted'
    });
  } catch (err) {
    next(err);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const isMember = await isTeamMember(projectId, req.user.id);
    if (project.admin_id !== req.user.id && !isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const stats = await getDashboardStats(projectId);
    const tasks = await getProjectTasks(projectId);

    res.json({
      project: {
        id: project.id,
        name: project.name,
        description: project.description
      },
      stats: stats,
      recentTasks: tasks.slice(0, 5),
      allTasks: tasks
    });
  } catch (err) {
    next(err);
  }
};
