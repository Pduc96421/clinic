import { Router } from "express";
const router: Router = Router();
import * as controllerAppointment from "../controllers/appointment.controller";
import * as validateAppointment from "../../../validates/appointment.validate";

router.get("/doctor/:doctorId", controllerAppointment.getDoctorAppointments);

router.post("/create", validateAppointment.createAppointment, controllerAppointment.createAppointment);

router.get("/detail/:appointmentId", controllerAppointment.getDetailAppointment);

router.patch(
  "/status/:appointmentId",
  validateAppointment.updateStatusAppointment,
  controllerAppointment.updateStatusAppointment,
);

export const appointmentRouter: Router = router;
