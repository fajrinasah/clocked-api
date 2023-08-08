import { verifyToken } from "../../helpers/token.js";
import * as errorStatus from "../globalErrorHandler/errorStatuses.js";
import * as errorMessage from "../globalErrorHandler/errorMessages.js";

// CHECK IF USER'S ROLE IS ADMIN (role_id: 1)
export async function verifyAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      throw { message: errorMessage.UNAUTHORIZED + `: no token was provided.` };

    const decoded = verifyToken(token);

    if (decoded?.roleId ? decoded?.roleId !== 1 : decoded?.role_id !== 1)
      throw {
        message:
          errorMessage.UNAUTHORIZED + `: only admin can access this feature.`,
      };

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(errorStatus.UNAUTHORIZED_STATUS).json({
      type: "error",
      status: errorStatus.UNAUTHORIZED_STATUS,
      message: error?.message,
      data: null,
    });
  }
}
