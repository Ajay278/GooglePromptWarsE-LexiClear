import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { legalRouter } from './server/routes/legalRoutes';
import { serverCache } from './server/services/cache';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Enable trust proxy so Express and express-rate-limit correctly identify client IPs behind Cloud Run / reverse proxies
app.set('trust proxy', 1);

// Security & Efficiency Middleware
app.use((_req: Request, res: Response, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

const portArgIndex = process.argv.indexOf('--port');
const portArg = portArgIndex !== -1 ? parseInt(process.argv[portArgIndex + 1], 10) : null;
const PORT = portArg || (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

app.use(express.json({ limit: '15mb' }));

// Healthcheck & Resource Efficiency endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    service: 'LexiClear Legal Navigator API',
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
    cacheStats: serverCache.getStats(),
    memory: {
      rssMb: Math.round(mem.rss / 1024 / 1024),
      heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024),
    },
  });
});

// Mount legal domain API router
app.use('/api', legalRouter);

// Full-stack Vite middleware & static asset delivery
const isProduction = process.env.NODE_ENV === 'production' || !process.argv.some(a => a.includes('tsx') || a.includes('--dev'));
const candidateDistDirs = [
  path.resolve(__dirname, 'dist'),
  __dirname,
  path.resolve(process.cwd(), 'dist'),
];
const distDir = candidateDistDirs.find(dir => fs.existsSync(path.resolve(dir, 'index.html')));
const hasDist = Boolean(distDir);

if (hasDist && (isProduction || process.env.NODE_ENV === 'production')) {
  app.use(express.static(distDir!));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(distDir!, 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`LexiClear Legal Navigator server running on port ${PORT}`);
});
