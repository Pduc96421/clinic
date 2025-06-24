import { Router } from 'express';
const router: Router = Router();

import * as authMiddleware from '../../../middlewares/auth.middleware';
import * as controllerSchedule from '../controllers/schedule.controller';

router.post('/create/:doctorId', authMiddleware.verifyToken, controllerSchedule.createSchedule);

router.get('/doctor/:doctorId', authMiddleware.verifyToken, controllerSchedule.getScheduleByDoctor);

router.patch('/update/:scheduleId', authMiddleware.verifyToken, controllerSchedule.updateSchedule);

export const scheduleRouter: Router = router;
