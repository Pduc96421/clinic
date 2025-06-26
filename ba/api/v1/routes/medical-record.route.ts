import { Router } from "express";
const router: Router = Router();
import * as controllerMedicalRecord from "../controllers/medical-record.controller";

router.post("/create", controllerMedicalRecord.createMedicalRecord);

router.get("/appointment/:appointmentId", controllerMedicalRecord.getRecordByAppointment);

router.patch("/update/:medicalRecordId", controllerMedicalRecord.updateMedicalRecord);

export const medicalRecordRouter: Router = router;
