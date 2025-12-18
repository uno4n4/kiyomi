import cors from 'cors';
import { RequestHandler } from 'express';

/**
 * CORS middleware isolé
 * Ne toucher pas aux autres partie du serveur
 */
export const corsMiddleware: RequestHandler = cors({
  origin: true, // autorise toutes les origines (dev)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
