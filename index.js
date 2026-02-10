import express from "express";
import { connecttoDB } from "./database/database.js";
import dotenv from "dotenv";
import authRoute from "./routes/UserRoutes.js";
import productRoute from "./routes/ProductRoutes.js";
import orderRoute from "./routes/OrderRoutes.js";
import cors from "cors";
import fileUpload from "express-fileupload";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

const port = process.env.PORT || 5000;
connecttoDB(process.env.MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Enable handling of multipart/form-data for image uploads
app.use(
  fileUpload({
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    abortOnLimit: true,
  }),
);

// Serve uploaded images statically
app.use("/uploads", express.static("uploads"));

// Simple request logger to verify routing and payloads
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  if (Object.keys(req.body || {}).length) {
    console.log("Body:", req.body);
  }
  next();
});

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/users", authRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
