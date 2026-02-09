import { z } from 'zod';
import { insertWaterQualitySchema, insertFilterProductSchema, insertUserScanSchema, waterQualityMetrics, filterProducts, userScans } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  water: {
    getByPlz: {
      method: 'GET' as const,
      path: '/api/water/:plz',
      responses: {
        200: z.array(z.custom<typeof waterQualityMetrics.$inferSelect>()),
        404: errorSchemas.notFound,
      },
    },
    // Mock endpoint to simulate aggregation
    aggregate: {
        method: 'POST' as const,
        path: '/api/water/aggregate',
        input: z.object({ plz: z.string() }),
        responses: {
            200: z.object({ message: z.string() }),
        }
    }
  },
  filters: {
    list: {
      method: 'GET' as const,
      path: '/api/filters',
      responses: {
        200: z.array(z.custom<typeof filterProducts.$inferSelect & { performance: any[] }>()),
      },
    },
    recommend: {
        method: 'POST' as const,
        path: '/api/filters/recommend',
        input: z.object({
            plz: z.string(),
            householdSize: z.number().optional(),
            budget: z.number().optional(),
        }),
        responses: {
            200: z.array(z.custom<typeof filterProducts.$inferSelect>()),
        }
    }
  },
  scans: {
    create: {
      method: 'POST' as const,
      path: '/api/scans',
      input: insertUserScanSchema,
      responses: {
        201: z.custom<typeof userScans.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
        method: 'GET' as const,
        path: '/api/scans',
        responses: {
            200: z.array(z.custom<typeof userScans.$inferSelect>()),
        }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
