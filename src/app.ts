import express from "express";
import dataRoutes from "./routes/index";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", dataRoutes);

export { app };