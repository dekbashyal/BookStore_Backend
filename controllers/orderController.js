export const getOrder = async (req, res) => {
  // Logic to get an order by ID

  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate([
      {
        path: "products.product",
        model: "Product",
      },
    ]);
    return res.status(200).json({
      status: "success",
      order,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const getOrders = async (req, res) => {
  // Logic to get all orders
  try {
    if (req.role === "admin") {
      const orders = await Order.find({}).populate([
        {
          path: "products.product",
          model: "Product",
        },
        {
          path: "userId",
          model: "User",
          select: "-password",
        },
      ]);
      return res.status(200).json({
        status: "success",
        orders,
      });
    } else {
      const orders = await Order.find({ userId: req.userId }).populate([
        {
          path: "products.product",
          model: "Product",
        },
      ]);
      return res.status(200).json({
        status: "success",
        orders,
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

export const createOrder = async (req, res) => {
  // Logic to create a new order
  const { products, totalAmount } = req.body ?? {};
  try {
    await Order.create({
      totalAmount,
      userId: req.userId,
      products,
    });
    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
