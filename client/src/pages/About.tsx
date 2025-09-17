import React from "react";
import jslogo from "../assets/jslogo.jpeg";  // 👈 extension confirm karo

const About = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>

      <div className="grid md:grid-cols-2 gap-10 items-center">
        {/* Image Section */}
        <img
          src={jslogo}
          alt="Jewelry Crafting"
          className="rounded-lg shadow-lg"
        />

        {/* Text Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            At <span className="font-semibold">Jewellery Store</span>, we believe
            jewelry is more than just an accessory — it’s a reflection of your
            style, personality, and precious memories.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every piece is handcrafted with love, combining timeless elegance
            with modern design. We are committed to using ethically sourced
            materials and delivering unmatched craftsmanship.
          </p>
        </div>
      </div>

      {/* Promise Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Why Choose Us?</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          ✅ 100% authentic & premium quality <br />
          ✅ Ethically sourced materials <br />
          ✅ Free shipping & easy returns <br />
          ✅ Trusted by thousands of happy customers
        </p>
      </div>
    </div>
  );
};

export default About;
