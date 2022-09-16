/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express';
import { RegisterController } from './controller/user.controller.export';

const router = Router();

router.post('/register', RegisterController);

export default router;
