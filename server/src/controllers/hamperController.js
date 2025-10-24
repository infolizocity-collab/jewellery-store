import Product from "../models/Product.js";
import Hamper from "../models/Hamper.js";
import { sendOrderEmail } from "../utils/email.js";  // ✅ Email util

/* =========================
   🛍 Create Custom Hamper
   ========================= */
export const createCustomHamper = async (req, res) => {
  try {
    const { title, items, customNote, shippingAddress } = req.body;

    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Please select at least one product" });
    }

    // ✅ Calculate total price from DB
    let totalPrice = 0;
    const formattedItems = [];

    for (const i of items) {
      const product = await Product.findById(i.product);
      if (product) {
        totalPrice += product.price * (i.quantity || 1);
        formattedItems.push({
          product: product._id,
          quantity: i.quantity || 1,
        });
      }
    }

    const hamper = new Hamper({
      user: req.user._id,
      title: title || "Custom Hamper",
      items: formattedItems,
      customNote: customNote || "",
      totalPrice,
      status: "pending", // default status
      address: shippingAddress || {},
    });

    const createdHamper = await hamper.save();

    // ✅ Email Content
    const itemsHtml = formattedItems
      .map(
        (i) =>
          `<li>${i.quantity} x ${i.product?.name || "Product"} — ₹${
            i.price * i.quantity
          }</li>`
      )
      .join("");

    const html = `
      <h2>🎁 Hamper Confirmation</h2>
      <p>Hi ${req.user.name},</p>
      <p>Your custom hamper <b>#${createdHamper._id}</b> has been created successfully.</p>
      <p><b>Total Amount:</b> ₹${createdHamper.totalPrice}</p>
      ${
        shippingAddress
          ? `<p><b>Shipping Address:</b> ${shippingAddress.street}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}</p>`
          : ""
      }
      <p><b>Items:</b></p>
      <ul>${itemsHtml}</ul>
      ${customNote ? `<p><b>Your Note:</b> ${customNote}</p>` : ""}
      <p>We will notify you when it is confirmed 🚚</p>
    `;

    await sendOrderEmail(req.user.email, "Hamper Confirmation", html);

    res.status(201).json(createdHamper);
  } catch (err) {
    console.error("Hamper Create Error:", err);
    res
      .status(500)
      .json({ message: "Server error while creating hamper", error: err.message });
  }
};

/* =========================
   👤 User: Get My Hampers
   ========================= */
export const getMyHampers = async (req, res) => {
  try {
    const hampers = await Hamper.find({ user: req.user._id }).populate(
      "items.product",
      "name price image"
    );
    res.json(hampers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   👑 Admin: Get All Hampers
   ========================= */
export const getAllHampers = async (req, res) => {
  try {
    const hampers = await Hamper.find()
      .populate("user", "name email")
      .populate("items.product", "name price image");
    res.json(hampers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================
   👑 Admin: Update Hamper Status
   ========================= */
export const updateHamperStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const hamper = await Hamper.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!hamper) return res.status(404).json({ message: "Hamper not found" });

    hamper.status = status || hamper.status;
    const updatedHamper = await hamper.save();

    // ✅ Status Update Email
    const html = `
      <h2>📢 Hamper Status Update</h2>
      <p>Hi ${hamper.user.name},</p>
      <p>Your hamper <b>#${hamper._id}</b> status has been updated.</p>
      <p><b>Current Status:</b> ${updatedHamper.status}</p>
    `;

    await sendOrderEmail(hamper.user.email, "Hamper Status Update", html);

    res.json(updatedHamper);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
