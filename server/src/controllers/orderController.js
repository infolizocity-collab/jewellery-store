import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderEmail } from "../utils/email.js";   // ✅ Import email util

// ✅ Create New Order
export const createOrder = async (req, res) => {
  try {
    const { items, address, paymentId, payment } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // Validate & enrich items
    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) throw new Error("Product not found");
        return {
          product: product._id,
          qty: item.qty,
          price: product.price,
        };
      })
    );

    // Total
    const total = populatedItems.reduce(
      (acc, item) => acc + item.price * item.qty,
      0
    );

    const order = new Order({
      user: req.user._id,
      items: populatedItems,
      total,
      address,
      paymentId: paymentId || null,
      payment: payment || "Cash on Delivery",
      status: "pending",
    });

    const createdOrder = await order.save();

    // ✅ Email Content
    const html = `
      <h2>🎉 Order Confirmation</h2>
      <p>Hi ${req.user.name},</p>
      <p>Your order <b>#${createdOrder._id}</b> has been placed successfully.</p>
      <p>Total Amount: <b>₹${createdOrder.total}</b></p>
      <p>Payment Method: ${createdOrder.payment}</p>
      <p>We will notify you when it ships.</p>
    `;

    // ✅ Send Email
    await sendOrderEmail(req.user.email, "Order Confirmation", html);

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get User Orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price image");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get Order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product", "name price image");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin - Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price image");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Admin - Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status || order.status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
