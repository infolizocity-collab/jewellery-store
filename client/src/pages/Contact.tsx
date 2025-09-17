import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("✅ Message sent successfully!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border p-3 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full border p-3 rounded"
            required
          />
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            className="w-full border p-3 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 py-3 rounded-lg font-semibold"
          >
            Send Message
          </button>
        </form>

        {/* Contact Info */}
        <div className="flex flex-col justify-center space-y-4">
          <h2 className="text-2xl font-semibold">Get in Touch</h2>
          <p className="text-gray-600">📍 123 Jewellery Street, New Delhi, India</p>
          <p className="text-gray-600">📞 +91 98765 43210</p>
          <p className="text-gray-600">✉️ support@jewellerystore.com</p>
          <p className="text-gray-600">🕑 Mon - Sat: 10am - 7pm</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
