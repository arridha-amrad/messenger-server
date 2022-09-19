/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express';

import {
   emailVerification,
   forgotPassword,
   googleOAuth,
   login,
   logout,
   refreshToken,
   register,
   resetPassword,
} from './controller/export.user.controller';

const router = Router();

router.post('/register', register);
router.get('/email-verification/:token', emailVerification);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/logout', logout);
router.get('/google', googleOAuth);
router.get('/refresh-token', refreshToken);
export default router;
