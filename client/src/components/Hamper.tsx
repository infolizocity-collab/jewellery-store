// src/components/Hamper.tsx
import { Link } from "react-router-dom";

const Hamper = () => {
  return (
    <section className="relative px-12 py-20 bg-gradient-to-r from-pink-100 via-white to-pink-100 text-center rounded-lg mx-4 shadow-md">
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-pink-50/40 rounded-lg"></div>

      <div className="relative z-10">
        <h2 className="text-3xl font-bold mb-4 text-pink-600">
  🎁 Create Your Own Hamper
</h2>
        <p className="text-gray-700 mb-8 max-w-xl mx-auto leading-relaxed">
          Curate a hamper with your favorite jewelry pieces and gift something truly personal & timeless.
        </p>

        <Link
          to="/hamper"
          className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-pink-400 text-white rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          Start Customizing
        </Link>
      </div>
    </section>
  );
};

export default Hamper;