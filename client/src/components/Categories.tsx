// src/components/Categories.tsx
import { Link } from "react-router-dom";
import Earrings from "../assets/earrings.jpg";
import Pendants from "../assets/pendants.jpg";
import Ring from "../assets/ring.jpeg";
import Bracelets from "../assets/bracelet.jpeg";

const categories = [
  { name: "Pendants", img: Pendants },
  { name: "Earrings", img: Earrings },
  { name: "Bracelets", img: Bracelets },
  { name: "Rings", img: Ring },
  { name: "Anklets", img: Earrings },
  { name: "Sets", img: Earrings },
];

const Categories = () => {
  return (
    <section className="relative px-12 py-20 bg-gradient-to-b from-white to-pink-50">
      <h3 className="text-3xl font-extrabold mb-12 text-center text-gray-800 tracking-wide">
        Shop by Category
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-10 text-center">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={`/category/${cat.name.toLowerCase()}`}
            className="group flex flex-col items-center cursor-pointer"
          >
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden shadow-lg border border-gray-200 group-hover:scale-105 transition duration-300 ease-out">
              <img
                src={cat.img}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:brightness-95"
              />
            </div>
            <span className="mt-4 text-lg font-semibold text-gray-700 group-hover:text-pink-600 transition">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
