import { Router } from 'express';

const router = Router();

// get room
router.get('/room/:roomId');

// get rooms
router.get('/rooms');

// send message
router.post('/message/:roomId');
router.delete('/message/:messageId');

export default router;
