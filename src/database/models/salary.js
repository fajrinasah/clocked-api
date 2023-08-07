import { DataTypes } from "sequelize";
import db from "../index.js";

export const Salary = db.sequelize.define(
  "salary",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    for: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    base_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    total_deduction: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    total_amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "salaries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  }
);
