const { Lead } = require("../models");

function getWorkspaceId(req) {
  return req.workspaceId || req.body?.workspaceId || req.user?.workspaceId;
}

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace context is required." });
    }

    const lead = await Lead.create({
      ...req.body,
      workspaceId,
    });

    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    const lead = await Lead.findOne({
      where: workspaceId ? { id: req.params.id, workspaceId } : { id: req.params.id },
    });

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = req.body?.note?.trim();
    if (!note) {
      return res.status(400).json({ message: "Note is required." });
    }

    const nextNotes = [lead.notes, note].filter(Boolean).join("\n\n");
    await lead.update({ notes: nextNotes });

    res.json({ message: "Note added", lead });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Leads
exports.getLeads = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    const leads = await Lead.findAll({
      where: workspaceId ? { workspaceId } : {},
      order: [["createdAt", "DESC"]],
    });

    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Single Lead
exports.getLead = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    const lead = await Lead.findOne({
      where: workspaceId ? { id: req.params.id, workspaceId } : { id: req.params.id },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Lead
exports.updateLead = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    const lead = await Lead.findOne({
      where: workspaceId ? { id: req.params.id, workspaceId } : { id: req.params.id },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await lead.update(req.body);

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Lead
exports.deleteLead = async (req, res) => {
  try {
    const workspaceId = getWorkspaceId(req);
    const lead = await Lead.findOne({
      where: workspaceId ? { id: req.params.id, workspaceId } : { id: req.params.id },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    await lead.destroy();

    res.json({
      message: "Lead deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};