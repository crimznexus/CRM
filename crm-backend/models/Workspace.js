const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Workspace = sequelize.define(
  "Workspace",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    logoUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    timeZone: {
      type: DataTypes.STRING,
      defaultValue: "UTC",
    },
    currency: {
      type: DataTypes.STRING,
      defaultValue: "USD",
    },
    pipelineStages: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    leadScoring: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    automatedFollowups: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    leadSourceTags: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    tableName: "workspaces",
    timestamps: true,
  }
);

module.exports = Workspace;