import crypto from 'node:crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
export async function createSession(userId) {
  const accessToken = crypto.randomBytes(30).toString('hex');
  const refreshToken = crypto.randomBytes(40).toString('hex');

  const now = Date.now();

  const session = await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(now + ONE_DAY),
  });

  return session;
}

export function setSessionCookies(res, session) {
  const baseCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  };

  res.cookie('accessToken', session.accessToken, {
    ...baseCookieOptions,
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    ...baseCookieOptions,
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', String(session._id), {
    ...baseCookieOptions,
    maxAge: ONE_DAY,
  });
}
