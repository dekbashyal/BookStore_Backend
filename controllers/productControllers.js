import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
  // Logic to get all products
  try {
    const products = await Product.find({});
    return res.status(200).json({
      status: "success",
      data: products,
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
      data: isExist,
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
  try {
    await Product.create({
      title,
      author,
      description,
      price,
      category,
      stock,
    });
    res.status(200).json({
      status: "success",
      data: "Product created successfully",
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
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { title, author, description, price, category, stock },
      { new: true, runValidators: true },
    );
    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }
    return res.status(200).json({
      status: "success",
      data: updatedProduct,
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
