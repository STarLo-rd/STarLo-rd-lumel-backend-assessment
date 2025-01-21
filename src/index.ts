import express from "express";
import { connectDB } from "./utils/database";
import { setupDataRefreshScheduler } from "./utils/scheduler";
import { logger } from "./utils/logger";
import dataRoutes from "./routes/index";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api", dataRoutes);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI || "mongodb://localhost:27017/lumel");

    // Initialize scheduler with default file path from environment
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
