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
    const user = await User?.findOne({ where: { uuid } });

    // CHECK IF USER IS AN EMPLOYEE AND HAVE NOT ACTIVATED THEIR ACCOUNT YET
    if (user.dataValues?.role_id === 2 && !user.dataValues.full_name) {
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.USER_DOES_NOT_EXISTS,
      };
    }

    // DELETE SENSITIVE DATA FROM USER'S DATA THAT WILL BE SENT TO CLIENT
    delete user?.dataValues?.id;
    delete user?.dataValues?.uuid;
    delete user?.dataValues?.password;
    delete user?.dataValues?.otp;
    delete user?.dataValues?.otp_exp;

    // SEND RESPONSE
    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};
