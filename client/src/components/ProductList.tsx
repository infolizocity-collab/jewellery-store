import { useEffect, useState } from "react";

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL || process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/api/products`, {
      method: "GET",
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Failed to fetch products:", err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(p => (
        <div key={p._id} className="border p-4 rounded shadow">
          <img src={p.image} alt={p.name} className="w-full h-48 object-cover mb-2" />
          <h3 className="text-lg font-semibold">{p.name}</h3>
          <p className="text-gray-600">₹{p.price}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;