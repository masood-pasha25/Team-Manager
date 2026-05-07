import {
  createProject,
  getProjectById,
  getUserProjects,
  updateProject,
  deleteProject,
  getTeamMembers,
  addTeamMember,
  removeTeamMember,
  isTeamMember
} from '../models/index.js';
import { validationResult } from 'express-validator';

export const createNewProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const project = await createProject(name, description, req.user.id);

    res.status(201).json({
      success: true,
      project: project
    });
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Check if user is a member or admin
    const isMember = await isTeamMember(projectId, req.user.id);
    if (project.admin_id !== req.user.id && !isMember) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const projects = await getUserProjects(req.user.id);
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const updateProjectDetails = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { name, description } = req.body;

    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only admin can update
    if (project.admin_id !== req.user.id) {
      return res.status(403).json({ error: 'Only project admin can update' });
    }

    const updatedProject = await updateProject(projectId, name, description);
    res.json({
      success: true,
      project: updatedProject
    });
  } catch (err) {
    next(err);
  }
};

export const deleteProjectById = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await getProjectById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only admin can delete
    if (project.admin_id !== req.user.id) {
      return res.status(403).json({ error: 'Only project admin can delete' });
    }

    await deleteProject(projectId);
    res.json({
      success: true,
      message: 'Project deleted'
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectTeam = async (req, res, next) => {
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

    const members = await getTeamMembers(projectId);
    res.json(members);
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { userId, role } = req.body;

    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only admin can add members
    if (project.admin_id !== req.user.id) {
      return res.status(403).json({ error: 'Only project admin can add members' });
    }

    const member = await addTeamMember(projectId, userId, role || 'member');
    res.status(201).json({
      success: true,
      member: member
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(400).json({ error: 'User is already a team member' });
    }
    next(err);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;

    const project = await getProjectById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Only admin can remove members
    if (project.admin_id !== req.user.id) {
      return res.status(403).json({ error: 'Only project admin can remove members' });
    }

    const member = await removeTeamMember(projectId, userId);
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }

    res.json({
      success: true,
      message: 'Member removed'
    });
  } catch (err) {
    next(err);
  }
};
