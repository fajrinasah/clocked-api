import { Router } from "express";

import { verifyAdmin } from "../../middlewares/index.js";
import * as salariesControllers from "./index.js";

const router = Router();

/*------------------------------------------------------------
POST
-------------------------------------------------------------*/
router.post("", verifyAdmin, salariesControllers.setSalary);

export default router;
