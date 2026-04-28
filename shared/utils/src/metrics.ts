import { Express, Request, Response } from 'express';
import { register, collectDefaultMetrics, Histogram } from 'prom-client';

export const initMetrics = (serviceName: string, app: Express) => {
  // Collect default system metrics (CPU, Memory, etc.)
  collectDefaultMetrics({ prefix: `${serviceName.replace('-', '_')}_` });

  // Custom HTTP request duration histogram
  const httpRequestDurationMicroseconds = new Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
  });

  // Middleware to measure request duration
  app.use((req: Request, res: Response, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      if (req.route) {
        end({ method: req.method, route: req.route.path, code: res.statusCode });
      }
    });
    next();
  });

  // Expose /metrics endpoint
  app.get('/metrics', async (req: Request, res: Response) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  
  console.log(`[Metrics] ${serviceName} metrics initialized at /metrics`);
};
