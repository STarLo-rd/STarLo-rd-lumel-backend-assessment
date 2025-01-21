import cron from 'node-cron';
import { loadCSVData } from './csvLoader';
import { logger } from './logger';

export function setupDataRefreshScheduler(filePath: string) {
  // Schedule daily refresh at midnight
  cron.schedule('* * * * *', async () => {
    logger.info('Starting scheduled data refresh');
    try {
      const stats = await loadCSVData(filePath);
      logger.info('Scheduled data refresh completed', {
        recordsProcessed: stats.recordsProcessed,
        errorCount: stats.errors.length
      });
    } catch (error) {
      logger.error('Scheduled data refresh failed:', error);
    }
  });

  logger.info('Data refresh scheduler initialized');
}