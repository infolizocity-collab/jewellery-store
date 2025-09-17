import Product from "../models/Product.js";
import Hamper from "../models/Hamper.js";

// 🛍 Create Custom Hamper
export const createCustomHamper = async (req, res) => {
  try {
    const { title, items, customNote } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Please select at least one product" });
    }

    // ✅ Calculate total price from DB
    let totalPrice = 0;
    const formattedItems = [];
    for (const i of items) {
      const product = await Product.findById(i.product);
      if (product) {
        totalPrice += product.price * (i.quantity || 1);
        formattedItems.push({ product: product._id, quantity: i.quantity || 1 });
      }
    }

    const hamper = new Hamper({
      user: req.user._id,
      title: title || "Custom Hamper",
      items: formattedItems,
      customNote: customNote || "",
      totalPrice,
      status: "pending", // default status
    });

    const createdHamper = await hamper.save();
    res.status(201).json(createdHamper);
  } catch (err) {
    console.error("Hamper Create Error:", err);
    res.status(500).json({ message: "Server error while creating hamper" });
  }
};

// 👤 User: Get My Hampers
export const getMyHampers = async (req, res) => {
  try {
    const hampers = await Hamper.find({ user: req.user._id })
      .populate("items.product", "name price image");
    res.json(hampers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 👑 Admin: Get All Hampers
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

// 👑 Admin: Update Hamper Status
export const updateHamperStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const hamper = await Hamper.findById(req.params.id);

    if (!hamper) return res.status(404).json({ message: "Hamper not found" });

    hamper.status = status || hamper.status;
    const updatedHamper = await hamper.save();

    res.json(updatedHamper);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
