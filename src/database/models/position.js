import { DataTypes } from "sequelize";
import db from "../index.js";

export const Position = db.sequelize.define(
  "position",
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
  },
  {
    tableName: "positions",
    timestamps: false,
  }
);
