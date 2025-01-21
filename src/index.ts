import express from "express";
import { connectDB } from "./utils/database";
import { loadCSVData } from "./utils/csvLoader";
import { setupDataRefreshScheduler } from "./utils/scheduler";
import { logger } from "./utils/logger";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Endpoint to trigger data loading
app.post("/api/load-data", async (req, res) => {
  try {
    const filePath = req.body.filePath;
    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    const stats = await loadCSVData(filePath);
    res.json({
      message: "Data loading completed",
      stats: {
        recordsProcessed: stats.recordsProcessed,
        errorCount: stats.errors.length,
      },
    });
  } catch (error) {
    logger.error("Error loading data:", error);
    res.status(500).json({ error: "Failed to load data" });
  }
});

async function startServer() {
  try {
    await connectDB();

    // Initialize scheduler with default file path from environment
    const defaultFilePath = process.env.DEFAULT_CSV_PATH;
    console.log(defaultFilePath);
    if (defaultFilePath) {
      console.log("ovr here");
      setupDataRefreshScheduler(defaultFilePath);
    }

    app.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
