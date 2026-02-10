import express from "express";
import {
  createOrder,
  getOrder,
  getOrders,
} from "../controllers/orderController.js";
import { checkUser } from "../middlewares/checkUser.js";

const router = express.Router();

router.route("/").get(checkUser, getOrders).post(checkUser, createOrder);

router.route("/:id").get(getOrder);

export default router;
