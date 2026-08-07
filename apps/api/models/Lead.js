const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Workspace = require("./Workspace");

const Lead = sequelize.define(
  "Lead",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    workspaceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    businessName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    ownerName: {
      type: DataTypes.STRING,
    },

    category: {
      type: DataTypes.STRING,
    },

    phone: {
      type: DataTypes.STRING,
    },

    email: {
      type: DataTypes.STRING,
    },

    website: {
      type: DataTypes.STRING,
    },

    address: {
      type: DataTypes.TEXT,
    },

    facebook: {
      type: DataTypes.STRING,
    },

    instagram: {
      type: DataTypes.STRING,
    },

    linkedin: {
      type: DataTypes.STRING,
    },

    group: {
      type: DataTypes.STRING,
    },

    assignedTo: {
      type: DataTypes.STRING,
    },

    notes: {
      type: DataTypes.TEXT,
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: "New",
    },

    source: {
      type: DataTypes.STRING,
      defaultValue: "Google Maps",
    },

    googlePlaceId: {
      type: DataTypes.STRING,
      unique: true,
    },

    googleMapsLink: {
      type: DataTypes.TEXT,
    },

    rating: {
      type: DataTypes.FLOAT,
    },

    reviewsCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "leads",
    timestamps: true,
  }
);

module.exports = Lead;