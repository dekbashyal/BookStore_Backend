import express from "express";
import { connecttoDB } from "./database/database.js";
import dotenv from "dotenv";
import authRoute from "./routes/UserRoutes.js";
import productRoute from "./routes/ProductRoutes.js";
import orderRoute from "./routes/OrderRoutes.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;
connecttoDB(process.env.MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// app.use((req, res) => {
//   res.status(404).json({ message: "Route not found" });
// });

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default server;
