import { Router } from "express";
const router: Router = Router();

import * as controllerFeedback from "../controllers/feedback.controller";
import * as validateFeedback from "../../../validates/feedback.validate";

router.post("/create", validateFeedback.createFeedback, controllerFeedback.createFeedback);

router.get("/doctor/:doctorId", controllerFeedback.getFeedbackByDoctor);

router.get("/appointment/:appointmentId", controllerFeedback.getFeedbackByAppointment);

export const feedbackRouter: Router = router;
