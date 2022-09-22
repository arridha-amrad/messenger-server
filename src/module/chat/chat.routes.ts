/* eslint-disable @typescript-eslint/no-misused-promises */
import { verifyAuthToken } from '@utils/token/token';

import { Router } from 'express';
import {
  getRooms,
  openRoom,
  sendMessage,
} from './controller/chat.controller.export';

const router = Router();

router.get('/room/:roomId', verifyAuthToken, openRoom);

router.get('/rooms', verifyAuthToken, getRooms);

router.post('/message', verifyAuthToken, sendMessage);

router.delete('/message/:messageId');

export default router;
