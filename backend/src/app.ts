import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import companyRoutes from './modules/company/company.routes';
import serviceRoutes from './modules/services/service.routes';
import deskRoutes from "./modules/desk/desk.routes";
import employeeRoutes from "./modules/employees/employee.routes";
import cardRoutes from "./modules/cards/card.routes";
import ticketRoutes from "./modules/ticket/ticket.routes";
import queueRoutes from "./modules/queue/queue.routes";
import notificationRoutes from "./modules/notifications/notification.routes";
import reportRoutes from "./modules/reports/report.routes";

const app = express();

app.use(cors());
app.use(express.json());

// Register API Module Routes
app.use('/api/auth', authRoutes);
app.use("/api/queue", queueRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/services', serviceRoutes);
app.use("/api/desk", deskRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/reports", reportRoutes);
app.use(
  "/api/notifications",
  notificationRoutes
);
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});


app.get("/", (req, res) => {
  res.json({
    name: "QueueFlow API",
    version: "1.0.0",
    status: "running",
    message: "Queue management backend is online"
  });
});

export default app;