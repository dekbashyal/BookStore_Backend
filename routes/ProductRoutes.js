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
import { updateCheckFile } from "../middlewares/checkFile.js";

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  // Optional image upload: updateCheckFile will set req.imagePath if a file is provided
  .post(checkUser, checkAdmin, updateCheckFile, createProduct);
router.put(
  "/admin/:id",
  checkId,
  checkUser,
  checkAdmin,
  updateCheckFile,
  updateProduct,
);

router
  .route("/:id")
  .get(checkId, getProductById)
  .put(checkId, checkUser, checkAdmin, updateCheckFile, updateProduct)
  .delete(checkId, checkUser, checkAdmin, deleteProduct);

export default router;
