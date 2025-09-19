

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-100 to-yellow-300 py-20 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Jewellery Store 🪙💍
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Discover timeless jewellery crafted with love and elegance.
        </p>
        <a
          href="/products"
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition"
        >
          Shop Now
        </a>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">
          <img
            src="https://cdn-icons-png.flaticon.com/512/991/991952.png"
            alt="Ring"
            className="w-20 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">Elegant Rings</h3>
          <p className="text-gray-600 mt-2">Starting from ₹2,999</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">
          <img
            src="https://cdn-icons-png.flaticon.com/512/992/992001.png"
            alt="Necklace"
            className="w-20 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">Necklaces</h3>
          <p className="text-gray-600 mt-2">Starting from ₹4,999</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl p-6 text-center hover:scale-105 transition">
          <img
            src="https://cdn-icons-png.flaticon.com/512/991/991976.png"
            alt="Earrings"
            className="w-20 mx-auto mb-4"
          />
          <h3 className="text-xl font-semibold text-gray-800">Earrings</h3>
          <p className="text-gray-600 mt-2">Starting from ₹1,999</p>
        </div>
      </section>
    </div>
  );
};

export default Home;
