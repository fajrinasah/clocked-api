import { Shift } from "../../database/models/shift.js";

/*----------------------------------------------------*/
// GET ALL SHIFTS
/*----------------------------------------------------*/
export const getAllShifts = async (req, res, next) => {
  try {
    const shifts = await Shift?.findAll();

    // SEND RESPONSE
    res.status(200).json({
      shifts,
    });
  } catch (error) {
    next(error);
  }
};
