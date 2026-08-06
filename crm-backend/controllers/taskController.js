const { Task, Lead, User } = require("../models");

const scope = (req) => ({ workspaceId: req.workspaceId });

exports.list = async (req, res, next) => {
  try {
    const tasks = await Task.findAll({
      where: scope(req), order: [["dueAt", "ASC"], ["createdAt", "DESC"]],
      include: [
        { model: Lead, as: "lead", attributes: ["id", "businessName", "phone", "email", "status"] },
        { model: User, as: "assignee", attributes: ["id", "fullName", "email"] },
      ],
    });
    res.json(tasks);
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { title, leadId, assignedToId, category, description, dueAt, priority, reminderEnabled } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Task title is required." });
    if (leadId) {
      const lead = await Lead.findOne({ where: { id: leadId, workspaceId: req.workspaceId } });
      if (!lead) return res.status(400).json({ message: "Selected lead does not belong to this workspace." });
    }
    const task = await Task.create({ workspaceId: req.workspaceId, createdById: req.user.id, title: title.trim(), leadId: leadId || null, assignedToId: assignedToId || req.user.id, category, description, dueAt: dueAt || null, priority, reminderEnabled });
    res.status(201).json(task);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, ...scope(req) } });
    if (!task) return res.status(404).json({ message: "Task not found." });
    const allowed = ["title", "leadId", "assignedToId", "category", "description", "dueAt", "priority", "status", "reminderEnabled"];
    const changes = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    await task.update(changes);
    res.json(task);
  } catch (error) { next(error); }
};

exports.remove = async (req, res, next) => {
  try {
    const count = await Task.destroy({ where: { id: req.params.id, ...scope(req) } });
    if (!count) return res.status(404).json({ message: "Task not found." });
    res.status(204).end();
  } catch (error) { next(error); }
};
