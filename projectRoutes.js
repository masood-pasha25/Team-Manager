import express from 'express';
import { body } from 'express-validator';
import {
  createNewProject,
  getProject,
  getProjects,
  updateProjectDetails,
  deleteProjectById,
  getProjectTeam,
  addMember,
  removeMember
} from '../controllers/projectController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All project routes require authentication
router.use(authenticateToken);

// Project CRUD operations
router.post('/', [
  body('name').notEmpty().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim()
], createNewProject);

router.get('/', getProjects);

router.get('/:projectId', getProject);

router.put('/:projectId', [
  body('name').notEmpty().trim().isLength({ min: 1, max: 255 }),
  body('description').optional().trim()
], updateProjectDetails);

router.delete('/:projectId', deleteProjectById);

// Team member routes
router.get('/:projectId/team', getProjectTeam);

router.post('/:projectId/team', [
  body('userId').isInt(),
  body('role').optional().isIn(['member', 'admin'])
], addMember);

router.delete('/:projectId/team/:userId', removeMember);

export default router;
