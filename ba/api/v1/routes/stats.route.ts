import { Router } from "express";
import * as controllerStats from "../controllers/stats.controller";

const router = Router();

router.get("/doctor/:doctorId/overview", controllerStats.getDoctorOverview);
router.get("/doctor/:doctorId/monthly", controllerStats.getDoctorMonthlyAppointments);
router.get("/doctor/:doctorId/ratings", controllerStats.getDoctorAverageRating);

export const statsRouter = router;
