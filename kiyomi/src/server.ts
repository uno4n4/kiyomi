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
app.use(cors({ origin: true }));
app.use(express.json());

/**
 * API REST - KIYOMI
 * (BACKEND TS dans server.ts pour ne pas toucher à l'arborescence)
 */

// GET /api/boxes/featured
app.get('/api/boxes/featured', (_req, res) => {
  res.json([
    {
      id: 'amateur-mix',
      name: 'Amateur Mix',
      pieces: 18,
      priceEUR: 10.9,
      imageUrl: '/assets/images/boxes/amateur-mix.jpg',
    },
    {
      id: 'fresh-mix',
      name: 'Fresh Mix',
      pieces: 22,
      priceEUR: 24.5,
      imageUrl: '/assets/images/boxes/fresh-mix.jpg',
    },
    {
      id: 'gourmet-mix',
      name: 'Gourmet Mix',
      pieces: 22,
      priceEUR: 24.5,
      imageUrl: '/assets/images/boxes/gourmet-mix.jpg',
    },
  ]);
});

// GET /api/stats/restaurant
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
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

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
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
