import { Router } from "express";
const router: Router = Router();

import * as controllerPrescription from "../controllers/prescription.controller";
import * as validatePrescription from "../../../validates/prescription.validate";
import * as validateAuthorization from "../../../validates/authorization.validate";

router.post(
  "/create",
  validateAuthorization.denyRoles(["patient"]),
  validatePrescription.createPrescription,
  controllerPrescription.createPrescription,
);

router.get("/medical-record/:recordId", controllerPrescription.getPrescriptionByRecord);

router.patch(
  "/update/:prescriptionId",
  validateAuthorization.denyRoles(["patient"]),
  validatePrescription.updatePrescription,
  controllerPrescription.updatePrescription,
);

export const prescriptionRouter: Router = router;
