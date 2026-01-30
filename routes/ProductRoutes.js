import express from "express";
import {
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../controllers/productControllers.js";
import { checkUser, checkAdmin } from "../middlewares/checkUser.js";
import { checkId } from "../middlewares/checkId.js";

const router = express.Router();

router.route("/").get(getProducts);
router.route("/post").post(createProduct);

router
  .route("/:id")
  .get(checkId, getProductById)
  .put(checkId, checkUser, checkAdmin, updateProduct)
  .delete(checkId, deleteProduct);
  

export default router;
