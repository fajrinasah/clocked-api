import { User } from "../../database/models/user.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";

/*----------------------------------------------------*/
// KEEP LOGIN
/*----------------------------------------------------*/
export const keepLogin = async (req, res, next) => {
  try {
    const { uuid } = req.user;

    // GET USER'S DATA AND PROFILE
    const user = await User?.findOne({
      where: { uuid },

      attributes: [
        "email",
        ["full_name", "fullName"],
        "dob",
        ["role_id", "roleId"],
        ["position_id", "positionId"],
        ["joined_at", "joinedAt"],
        ["updated_at", "updatedAt"],
      ],
    });

    // CHECK IF USER IS AN EMPLOYEE AND HAVE NOT ACTIVATED THEIR ACCOUNT YET
    if (user.dataValues?.roleId === 2 && !user.dataValues.fullName) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };
    }

    // SEND RESPONSE
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
