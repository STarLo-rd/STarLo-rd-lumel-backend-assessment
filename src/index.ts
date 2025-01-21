import { app } from "./app";
import { connectDB } from "./utils/database";
import { setupDataRefreshScheduler } from "./utils/scheduler";
import { logger } from "./utils/logger";

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB(
      process.env.MONGODB_URI || "mongodb://localhost:27017/lumel"
    );
    const defaultFilePath = process.env.DEFAULT_CSV_PATH;
    if (defaultFilePath) {
      setupDataRefreshScheduler(defaultFilePath);
    }
    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
