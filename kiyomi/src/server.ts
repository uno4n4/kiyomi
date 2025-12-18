import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import cors from 'cors';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Middlewares
 */
app.use(express.json());

// ✅ CORS (utile si tu testes depuis 4200)
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

/**
 * ✅ API REST - KIYOMI (TS)
 * On garde tout dans server.ts pour ne pas casser l’arborescence.
 */

// (option) check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// ✅ GET /api/boxes/featured
app.get('/api/boxes/featured', (_req, res) => {
  res.json([
    {
      id: 'amateur-mix',
      name: 'AMATEUR MIX',
      pieces: 18,
      priceEUR: 10.9,
      imageUrl: 'assets/images/boxes/amateur-mix.jpg',
    },
    {
      id: 'fresh-mix',
      name: 'FRESH MIX',
      pieces: 22,
      priceEUR: 24.5,
      imageUrl: 'assets/images/boxes/fresh-mix.jpg',
    },
    {
      id: 'gourmet-mix',
      name: 'GOURMET MIX',
      pieces: 22,
      priceEUR: 24.5,
      imageUrl: 'assets/images/boxes/gourmet-mix.jpg',
    },
  ]);
});

// ✅ GET /api/stats/restaurant
app.get('/api/stats/restaurant', (_req, res) => {
  res.json({
    percentages: {
      takeaway: 28,
      delivery: 57,
      onSite: 15,
    },
    charts: {
      weeklyOrders: [
        { label: 'Lun', value: 12 },
        { label: 'Mar', value: 28 },
        { label: 'Mer', value: 22 },
        { label: 'Jeu', value: 31 },
        { label: 'Ven', value: 26 },
        { label: 'Sam', value: 38 },
        { label: 'Dim', value: 20 },
      ],
      satisfaction: [
        { label: 'Service', value: 78 },
        { label: 'Qualité', value: 85 },
        { label: 'Rapport Q/P', value: 72 },
        { label: 'Livraison', value: 66 },
      ],
    },
  });
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

/**
 * Start server
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) throw error;
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by Angular CLI
 */
export const reqHandler = createNodeRequestHandler(app);
