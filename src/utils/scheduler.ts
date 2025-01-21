import cron from "node-cron";
import { loadCSVData } from "./csvLoader";
import { logger } from "./logger";

export function setupDataRefreshScheduler(filePath: string) {
  // Schedule the task to run every day at 12:00 AM
  cron.schedule("0 0 * * *", async () => {
    logger.info("Starting scheduled data refresh");
    try {
      const stats = await loadCSVData(filePath);
      logger.info("Scheduled data refresh completed", {
        recordsProcessed: stats.recordsProcessed,
        errorCount: stats.errors.length,
      });
    } catch (error) {
      logger.error("Scheduled data refresh failed:", error);
    }
  });

  logger.info("Data refresh scheduler initialized");
}
