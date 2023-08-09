import { ValidationError } from "yup";
import chalk from "chalk";
import { DateTime } from "luxon";

import { User } from "../../database/models/user.js";
import { AttendanceLog, Shift } from "../../database/models/associations.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";

/*----------------------------------------------------*/
// GET ONE'S OWN TODAY LOG
/*----------------------------------------------------*/
export const getOwnTodayLog = async (req, res, next) => {
  try {
    const { uuid } = req.user;

    // GET EMPLOYEE'S DATA
    const employee = await User?.findOne({
      where: { uuid },
    });

    // GET LOG
    const log = await AttendanceLog.findOne({
      where: {
        employee_id: employee?.dataValues?.id,
        scheduled_date: DateTime.now().toFormat("yyyy-LL-dd"),
      },

      attributes: [
        "id",
        ["scheduled_date", "scheduledDate"],
        ["clocked_in", "clockedIn"],
        ["clocked_out", "clockedOut"],
        ["salary_deduction", "salaryDeduction"],
      ],

      include: [
        {
          model: Shift,
          attributes: [
            "id",
            "name",
            ["from_time", "fromTime"],
            ["to_time", "toTime"],
          ],
          required: true,
        },
      ],
    });

    // SEND RESPONSE
    res.status(200).json({
      log,
    });
  } catch (error) {
    next(error);
  }
};
