import { DataTypes } from "sequelize";
import db from "../index.js";

export const Shift = db.sequelize.define(
  "shift",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: true,
    },

    from_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    to_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
  },
  {
    tableName: "shifts",
    timestamps: false,
  }
);
