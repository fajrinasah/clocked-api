import { Position } from "../../database/models/position.js";

export const getAllPositions = async (req, res, next) => {
  try {
    const positions = await Position?.findAll({
      order: [["name", "ASC"]],
    });

    // SEND RESPONSE
    res.status(200).json({
      positions,
    });
  } catch (error) {
    next(error);
  }
};
