import { DataTypes } from "sequelize";
import db from "../index.js";

export const AttendanceLog = db.sequelize.define(
  "attendanceLog",
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

    scheduled_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    shift_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    clocked_in: {
      type: DataTypes.DATE,
      defaultValue: null,
    },

    clocked_out: {
      type: DataTypes.DATE,
      defaultValue: null,
    },

    salary_deduction: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
  },
  {
    tableName: "attendance_logs",
    timestamps: false,
  }
);
