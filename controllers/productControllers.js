import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

const isRemoteUrl = (value) =>
  typeof value === "string" && /^(https?:)?\/\//i.test(value);

const resolveImageUrl = (req, image) => {
  if (!image) return null;
  if (isRemoteUrl(image)) return image;
  const base = `${req.protocol}://${req.get("host")}`;
  return `${base}/uploads/${image}`;
};

export const getProducts = async (req, res) => {
  // Logic to get all products
  try {
    const products = await Product.find({});
    const data = products.map((p) => ({
      ...p.toObject(),
      imageUrl: resolveImageUrl(req, p.image),
    }));
    return res.status(200).json({
      status: "success",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      data: err,
    });
  }
};

export const getProductById = async (req, res) => {
  // Logic to get a product by ID
  try {
    const isExist = await Product.findById(req.id);
    if (!isExist)
      return res.status(404).json({
        status: "error",
        data: "Product not found",
      });
    return res.status(200).json({
      status: "success",
      data: {
        ...isExist.toObject(),
        imageUrl: resolveImageUrl(req, isExist.image),
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      data: err.message,
    });
  }
};

export const createProduct = async (req, res) => {
  // Logic to create a new product
  const { title, author, description, price, category, stock } = req.body ?? {};
  const providedImage = req.body?.image || req.body?.imageUrl;
  if (!req.body) {
    return res.status(400).json({
      status: "error",
      data: "Request body is missing. Ensure Content-Type: application/json and send a JSON payload.",
    });
  }
  if (!title || !author || !description || !price || !category || !stock) {
    return res.status(400).json({
      status: "error",
      data: "All fields (title, author, description, price, category, stock) are required.",
    });
  }
  // Accept either uploaded file (req.imagePath) or a direct image URL/body string
  const imageValue = req.imagePath || providedImage;
  if (!imageValue) {
    return res.status(400).json({
      status: "error",
      data: "Provide an image file (multipart/form-data) or an image URL in body.",
    });
  }
  try {
    const created = await Product.create({
      title,
      author,
      description,
      price,
      category,
      stock,
      image: imageValue,
    });
    res.status(200).json({
      status: "success",
      data: {
        ...created.toObject(),
        imageUrl: resolveImageUrl(req, created.image),
      },
      message: "Product created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      data: err.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  // Logic to update a product by ID
  const { id } = req.params;
  const { title, author, description, price, category, stock } = req.body;
  const providedImage = req.body?.image || req.body?.imageUrl;
  if (
    !title ||
    !author ||
    !description ||
    category == null ||
    price == null ||
    stock == null
  ) {
    return res.status(400).json({
      status: "error",
      message: "All fields are required",
    });
  }
  try {
    // Find existing to optionally replace/delete image file
    const existing = await Product.findById(id);
    if (!existing) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    // Determine if new image was provided via upload or URL
    const newImageValue = req.imagePath || providedImage;

    // If replacing image and the old one is a local file, delete it
    if (newImageValue && existing.image && !isRemoteUrl(existing.image)) {
      const oldPath = path.join("uploads", existing.image);
      fs.access(oldPath, fs.constants.F_OK, (accessErr) => {
        if (!accessErr) {
          fs.unlink(oldPath, () => {});
        }
      });
    }

    const updateData = { title, author, description, price, category, stock };
    if (newImageValue) {
      updateData.image = newImageValue;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({
      status: "success",
      data: {
        ...updatedProduct.toObject(),
        imageUrl: resolveImageUrl(req, updatedProduct.image),
      },
      message: "Product updated successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  // Logic to delete a product by ID
  try {
    const isExist = await Product.findById(req.id);
    if (!isExist)
      return res.status(404).json({
        status: "error",
        data: "Product not found",
      });
    // Delete local image file if present and not a remote URL
    if (isExist.image && !isRemoteUrl(isExist.image)) {
      const imgPath = path.join("uploads", isExist.image);
      fs.access(imgPath, fs.constants.F_OK, (accessErr) => {
        if (!accessErr) {
          fs.unlink(imgPath, () => {});
        }
      });
    }
    const deletedProduct = await Product.findByIdAndDelete(req.id);
    return res.status(200).json({
      status: "success",
      data: deletedProduct,
      message: "Product deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      data: err.message,
    });
  }
};
