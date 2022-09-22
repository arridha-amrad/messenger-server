/* eslint-disable @typescript-eslint/no-misused-promises */
import { verifyAuthToken } from '@utils/token/token';

import { Router } from 'express';
import { sendMessage } from './controller/chat.controller.export';

const router = Router();

// get room
router.get('/room/:roomId');

// get rooms
router.get('/rooms');

// send message
router.post('/message', verifyAuthToken, sendMessage);
router.delete('/message/:messageId');

export default router;
