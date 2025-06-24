import { Router } from 'express';
const router: Router = Router();

import * as controllerDoctor from '../controllers/doctor.controller';
import * as authMiddleware from '../../../middlewares/auth.middleware';

router.get('/list-doctor', controllerDoctor.listDoctor);

router.get('/info/:doctorId', authMiddleware.verifyToken, controllerDoctor.getInfoDoctor);

router.patch('/update/:doctorId', authMiddleware.verifyToken, controllerDoctor.updateDoctor);

export const doctorRouter: Router = router;
