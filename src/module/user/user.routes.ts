/* eslint-disable @typescript-eslint/no-misused-promises */

import { Router } from 'express';

import {
  emailVerification,
  forgotPassword,
  googleOAuth,
  login,
  logout,
  me,
  refreshToken,
  register,
  resetPassword,
  searchUser,
} from './controller/export.user.controller';

import { verifyAuthToken } from '@utils/token/token';

const router = Router();

router.post('/register', register);
router.get('/email-verification/:token', emailVerification);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/logout', logout);
router.get('/google', googleOAuth);
router.get('/refresh-token', refreshToken);
router.get('/me', verifyAuthToken, me);
router.get('/search', searchUser);
export default router;
