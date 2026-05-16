import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { MOCK_CLIENTS } from "./src/lib/mockData";
import { calculateKPIs } from "./src/lib/engine";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // IN-MEMORY "DATABASE"
  let clientsDB = [...MOCK_CLIENTS];

  // API ROUTES

  // Get all active clients
  app.get("/api/clients", (req, res) => {
    const activeClients = clientsDB.filter(c => c.is_active);
    res.json(activeClients);
  });

  // Database C: The synthesis logic triggers
  const updateKPIs = (clientId: string) => {
    const index = clientsDB.findIndex(c => c.id === clientId);
    if (index !== -1) {
      const client = clientsDB[index];
      const newKPIs = calculateKPIs(client.groupA, client.groupB);
      clientsDB[index] = { ...client, kpis: newKPIs };
      return clientsDB[index];
    }
    return null;
  };

  // Group A Update
  app.post("/api/clients/:id/groupA", (req, res) => {
    const { id } = req.params;
    const body = req.body;
    
    const index = clientsDB.findIndex(c => c.id === id);
    if (index !== -1) {
      clientsDB[index].groupA = { ...clientsDB[index].groupA, ...body };
      // Database C Trigger
      const updatedClient = updateKPIs(id);
      res.json(updatedClient);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  });

  // Group B Update
  app.post("/api/clients/:id/groupB", (req, res) => {
    const { id } = req.params;
    const body = req.body;
    
    const index = clientsDB.findIndex(c => c.id === id);
    if (index !== -1) {
      clientsDB[index].groupB = { ...clientsDB[index].groupB, ...body };
      // Database C Trigger
      const updatedClient = updateKPIs(id);
      res.json(updatedClient);
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  });

  // Soft Delete
  app.delete("/api/clients/:id", (req, res) => {
    const { id } = req.params;
    const index = clientsDB.findIndex(c => c.id === id);
    if (index !== -1) {
      clientsDB[index].is_active = false;
      res.json({ success: true });
    } else {
      res.status(404).json({ error: "Client not found" });
    }
  });

  // Seed Data Trigger
  app.post("/api/clients/seed", (req, res) => {
    const newClients = req.body;
    if (Array.isArray(newClients)) {
      clientsDB = newClients;
      res.json({ success: true, count: clientsDB.length });
    } else {
      res.status(400).json({ error: "Expected an array of clients" });
    }
  });

  // VITE MIDDLEWARE FOR DEVELOPMENT
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // PRODUCTION STATIC SERVING
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
