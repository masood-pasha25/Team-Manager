import express from 'express';
import { body } from 'express-validator';
import {
  createNewTask,
  getTask,
  getProjectTasksList,
  getMyTasksList,
  updateTaskDetails,
  updateTask_Status,
  deleteTaskById,
  getDashboard
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticateToken);

// User tasks
router.get('/user/my-tasks', getMyTasksList);

// Project tasks
router.post('/:projectId/tasks', [
  body('title').notEmpty().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim(),
  body('assignedTo').optional().isInt(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601()
], createNewTask);

router.get('/:projectId/dashboard', getDashboard);

router.get('/:projectId/tasks', getProjectTasksList);

router.get('/:projectId/tasks/:taskId', getTask);

router.put('/:projectId/tasks/:taskId', [
  body('title').optional().notEmpty().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim(),
  body('assignedTo').optional().isInt(),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601()
], updateTaskDetails);

router.patch('/:projectId/tasks/:taskId/status', [
  body('status').isIn(['todo', 'in_progress', 'completed'])
], updateTask_Status);

router.delete('/:projectId/tasks/:taskId', deleteTaskById);

export default router;
