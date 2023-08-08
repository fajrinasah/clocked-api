import { User } from "../../database/models/user.js";

export const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await User?.findAll({
      where: { role_id: 2 },

      attributes: ["email", ["full_name", "fullName"]],
    });

    // SEND RESPONSE
    res.status(200).json({
      employees,
    });
  } catch (error) {
    next(error);
  }
};
