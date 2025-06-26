import { Router } from 'express';
const router: Router = Router();

import * as controllerDoctor from '../controllers/doctor.controller';

router.get('/list-doctor', controllerDoctor.listDoctor);

router.get('/info/:doctorId', controllerDoctor.getInfoDoctor);

router.patch('/update/:doctorId', controllerDoctor.updateDoctor);

export const doctorRouter: Router = router;
