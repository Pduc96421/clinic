import { Router } from "express";
const router: Router = Router();
import * as controllerMedicalRecord from "../controllers/medical-record.controller";

router.post("/create", controllerMedicalRecord.createMedicalRecord);

export const medicalRecordRouter: Router = router;
