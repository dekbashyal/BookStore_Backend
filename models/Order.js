import mongoose from "mongoose";


const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    products: {
      type: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
    validate: {
      validator: function (v) {
        return v.length > 0;
      },
      message: "Order must have at least one product",
      }
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;