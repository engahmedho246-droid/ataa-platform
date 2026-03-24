import jwt from 'jsonwebtoken';
import { config } from '../config';
import { AuthPayload } from '../types';

export const generateToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

export const verifyToken = (token: string): AuthPayload => {
  return jwt.verify(token, config.jwt.secret) as AuthPayload;
};

export const generateCertificateHash = (volunteerId: string, opportunityId: string, timestamp: number): string => {
  const data = `${volunteerId}:${opportunityId}:${timestamp}:${Math.random()}`;
  return Buffer.from(data).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 32).toUpperCase();
};

export const generateQRToken = (opportunityId: string, volunteerId: string): string => {
  const data = `${opportunityId}:${volunteerId}:${Date.now()}:${Math.random().toString(36).substring(7)}`;
  return Buffer.from(data).toString('base64').substring(0, 20);
};
