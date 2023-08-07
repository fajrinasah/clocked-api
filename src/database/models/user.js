import { DataTypes } from "sequelize";
import db from "../index.js";

export const User = db.sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },

    email: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },

    password: {
      type: DataTypes.STRING(255),
      defaultValue: null,
    },

    full_name: {
      type: DataTypes.STRING(45),
      defaultValue: null,
    },

    dob: {
      type: DataTypes.DATEONLY,
      defaultValue: null,
    },

    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 2,
    },

    position_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    otp: {
      type: DataTypes.STRING(10),
      defaultValue: null,
    },

    otp_exp: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    createdAt: "joined_at",
    updatedAt: "updated_at",
  }
);
