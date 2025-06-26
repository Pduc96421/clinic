import { Router } from 'express';
const router: Router = Router();

import * as controllerSchedule from '../controllers/schedule.controller';

router.post('/create/:doctorId', controllerSchedule.createSchedule);

router.get('/doctor/:doctorId', controllerSchedule.getScheduleByDoctor);

router.patch('/update/:scheduleId', controllerSchedule.updateSchedule);

export const scheduleRouter: Router = router;
