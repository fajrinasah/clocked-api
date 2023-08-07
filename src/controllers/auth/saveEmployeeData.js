import * as helpers from "../../helpers/index.js";
import * as errorStatus from "../../middlewares/globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../../middlewares/globalErrorHandler/errorMessages.js";
import { User } from "../../database/models/user.js";
import * as validation from "./validationSchemata/index.js";

/*----------------------------------------------------*/
// SAVE EMPLOYEE DATA
/*----------------------------------------------------*/
export const saveEmployeeData = async (req, res, next) => {
  try {
    const { uuidWithContext } = req.params;
    const { full_name, dob, password } = req.body;
    await validation.saveEmployeeDataValidationSchema.validate(req.body);

    // GET UUID
    const cleanedUuid = uuidWithContext.split("-")?.slice(1)?.join("-");

    // CHECK IF EMPLOYEE ALREADY ACTIVATED THEIR ACCOUNT
    // by checking if full name, dob, and password are not null
    const user = await User?.findOne({
      where: { uuid: cleanedUuid },
    });

    if (
      user.dataValues.full_name &&
      user.dataValues.dob &&
      user.dataValues.password
    )
      throw {
        status: errorStatus.BAD_REQUEST_STATUS,
        message: errorMessage.BAD_REQUEST + ": account was already activated.",
      };

    // DECRYPT HASHED PASSWORD FROM CLIENT
    const decrypted = helpers.encryptions.decrypt(password);

    // HASH DECRYPTED HASHED-PASSWORD
    const hashedPassword = helpers.encryptions.hash(decrypted, 10);

    // UPDATE EMPLOYEE DATA
    await User?.update(
      { full_name, dob, password: hashedPassword },
      { where: { uuid: cleanedUuid } }
    );

    // SEND RESPONSE
    res.status(200).json({
      message:
        "Full name, date of birth, and password was updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};
