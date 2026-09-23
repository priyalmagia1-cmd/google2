import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Endpoints
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", campaign: "Google Gear Drop 2026" });
  });

  // Simulated GA4 event server endpoint
  app.post("/api/ga4/event", (req, res) => {
    const { event_name, params, timestamp } = req.body;
    console.log(`[GA4 Server Telemetry] ${event_name}:`, params);
    let loggedAt = new Date().toISOString();
    if (timestamp) {
      const parsed = new Date(timestamp);
      if (!isNaN(parsed.getTime())) {
        loggedAt = parsed.toISOString();
      }
    }
    res.json({
      success: true,
      logged_at: loggedAt,
      event_name,
    });
  });

  // Simulated Order placement API endpoint
  app.post("/api/orders", (req, res) => {
    const { items, total, currency, paymentMethod, shippingAddress } = req.body;
    const orderId = "GGD-" + Math.floor(100000 + Math.random() * 900000);
    const estimatedDelivery = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    res.json({
      success: true,
      orderId,
      status: "Processing",
      total,
      currency,
      paymentMethod,
      shippingAddress,
      estimatedDelivery,
      created_at: new Date().toISOString(),
    });
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Google Gear Drop Server running at http://localhost:${PORT}`);
  });
}

startServer();
