import express from "express";
import { connectDB } from "./utils/database";
import { loadCSVData } from "./utils/csvLoader";

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
    
    console.log(req.body);

    const filePath = req.body.filePath;
    if (!filePath) {
      return res.status(400).json({ error: "File path is required" });
    }

    await loadCSVData(filePath);
    res.json({ message: "Data loading process started" });
  } catch (error) {
    console.error("Error loading data:", error);
    res.status(500).json({ error: "Failed to load data" });
  }
});

async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
