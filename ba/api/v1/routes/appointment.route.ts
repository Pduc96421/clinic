import { Router } from "express";
const router: Router = Router();
import * as controllerAppointment from "../controllers/appointment.controller";

router.get("/doctor/:doctorId", controllerAppointment.getDoctorAppointments);

export default router;
