const { Workspace, User } = require("../models");

exports.get = async (req, res, next) => {
  try {
    const workspace = await Workspace.findByPk(req.workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found." });
    res.json(workspace);
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const workspace = await Workspace.findByPk(req.workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found." });
    await workspace.update({
      companyName: req.body.companyName ?? workspace.companyName,
      logoUrl: req.body.logoUrl ?? workspace.logoUrl,
      timeZone: req.body.timeZone ?? workspace.timeZone,
      currency: req.body.currency ?? workspace.currency,
      pipelineStages: req.body.pipelineStages ?? workspace.pipelineStages,
      leadScoring: req.body.leadScoring ?? workspace.leadScoring,
      automatedFollowups: req.body.automatedFollowups ?? workspace.automatedFollowups,
      leadSourceTags: req.body.leadSourceTags ?? workspace.leadSourceTags,
    });
    res.json(workspace);
  } catch (error) { next(error); }
};

exports.members = async (req, res, next) => {
  try {
    const users = await User.findAll({ where: { workspaceId: req.workspaceId }, attributes: { exclude: ["passwordHash"] }, order: [["createdAt", "ASC"]] });
    res.json(users);
  } catch (error) { next(error); }
};
