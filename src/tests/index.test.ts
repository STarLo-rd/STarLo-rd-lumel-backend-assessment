import request from 'supertest';
import { app } from '../app';
import { loadCSVData } from '../services/dataService';
import { getTopProducts, getTopProductsByCategory, getTopProductsByRegion } from '../services/analyticsService';

// Mock the services
jest.mock('../services/dataService');
jest.mock('../services/analyticsService');

describe('API Endpoints', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /health', () => {
    it('should return status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('POST /api/load-data', () => {
    it('should successfully load data with valid file path', async () => {
      const mockStats = {
        recordsProcessed: 100,
        errors: []
      };
      
      (loadCSVData as jest.Mock).mockResolvedValue(mockStats);

      const response = await request(app)
        .post('/api/load-data')
        .send({ filePath: 'test.csv' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Data loading completed',
        stats: {
          recordsProcessed: 100,
          errorCount: 0
        }
      });
    });

    it('should return 400 if file path is missing', async () => {
      const response = await request(app)
        .post('/api/load-data')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'File path is required' });
    });
  });

  describe('GET /api/analytics/top-products', () => {
    it('should return top products', async () => {
      const mockProducts = [
        { productId: 'P123', name: 'Product 1', totalQuantity: 100 }
      ];
      
      (getTopProducts as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/analytics/top-products')
        .query({ limit: '10', startDate: '2025-01-21', endDate: '2025-02-07' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(getTopProducts).toHaveBeenCalledWith({
        limit: 10,
        startDate: '2025-01-21',
        endDate: '2025-02-07'
      });
    });
  });

  describe('GET /api/analytics/top-products-by-category', () => {
    it('should return top products by category', async () => {
      const mockProducts = [
        { productId: 'P123', name: 'Product 1', category: 'Electronics', totalQuantity: 100 }
      ];
      
      (getTopProductsByCategory as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/analytics/top-products-by-category')
        .query({ 
          limit: '10', 
          category: 'Electronics',
          startDate: '2025-01-21', 
          endDate: '2025-02-07' 
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(getTopProductsByCategory).toHaveBeenCalledWith({
        limit: 10,
        category: 'Electronics',
        startDate: '2025-01-21',
        endDate: '2025-02-07'
      });
    });
  });

  describe('GET /api/analytics/top-products-by-region', () => {
    it('should return top products by region', async () => {
      const mockProducts = [
        { productId: 'P123', name: 'Product 1', region: 'Asia', totalQuantity: 100 }
      ];
      
      (getTopProductsByRegion as jest.Mock).mockResolvedValue(mockProducts);

      const response = await request(app)
        .get('/api/analytics/top-products-by-region')
        .query({ 
          limit: '10', 
          region: 'Asia',
          startDate: '2025-01-21', 
          endDate: '2025-02-07' 
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
      expect(getTopProductsByRegion).toHaveBeenCalledWith({
        limit: 10,
        region: 'Asia',
        startDate: '2025-01-21',
        endDate: '2025-02-07'
      });
    });
  });
});