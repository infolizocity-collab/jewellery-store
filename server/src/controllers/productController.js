import Product from "../models/Product.js";
import slugify from "slugify";

// ✅ Create Product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      onSale,
      category,
      stock,
      image,
      images,
      tags,       // 🔹 new
      featured,   // 🔹 new
    } = req.body;

    // Slug generate
    let slug = slugify(name, { lower: true, strict: true });

    // Agar slug already hai to unique bana do
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      onSale,
      category,
      stock,
      image,
      images,
      slug,
      tags: tags || [],
      featured: featured || false,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("❌ Product create error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get All Products (with filter support)
export const getProducts = async (req, res) => {
  try {
    const { tag, featured } = req.query;

    let filter = {};
    if (tag) filter.tags = tag; // e.g. ?tag=diwali
    if (featured === "true") filter.featured = true;

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Get Product by Slug
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ✅ Add Review to a Product
export const addProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { id } = req.params; // product id

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    // ✅ New review object
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    // ✅ Push review in array
    product.reviews.push(review);

    // ✅ Save (rating & numReviews auto update ho jayenge hook se)
    await product.save();

    res.status(201).json({ message: "Review added!" });
  } catch (error) {
    console.error("❌ Review error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
