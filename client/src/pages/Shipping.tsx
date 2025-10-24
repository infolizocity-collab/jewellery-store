export default function ShippingReturns() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-700">
      {/* Heading */}
      <h1 className="text-3xl font-bold text-center text-yellow-600 mb-10">
        Shipping & Returns
      </h1>

      {/* Shipping Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">📦 Shipping Policy</h2>
        <ul className="space-y-3 list-disc list-inside">
          <li>
            We ship across **India** using trusted courier partners like Delhivery,
            Bluedart & India Post.
          </li>
          <li>
            **Delivery Time**: 4–7 business days for standard shipping.  
            Express 1–3 day delivery available at checkout (extra charges apply).
          </li>
          <li>
            **Shipping Charges**: Free shipping on orders above ₹999.  
            A flat ₹70 charge applies on orders below ₹999.
          </li>
          <li>
            Orders are dispatched within 24–48 hours after confirmation.
          </li>
          <li>
            Tracking details will be shared via email/SMS once the order is shipped.
          </li>
        </ul>
      </section>

      {/* Returns Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">🔄 Return & Refund Policy</h2>
        <ul className="space-y-3 list-disc list-inside">
          <li>
            We offer **7-day easy returns** from the date of delivery for unused,
            unworn items with original packaging.
          </li>
          <li>
            To initiate a return, email us at
            <span className="font-medium text-black"> queensera.jewels@gmail.com</span>
            with your order ID and reason for return.
          </li>
          <li>
            Once approved, we will arrange a reverse pickup. Refund will be processed
            to your original payment method within 5–7 business days after the product
            is received and inspected.
          </li>
          <li>
            Customized or engraved jewellery is **non-returnable** unless damaged during delivery.
          </li>
        </ul>
      </section>

      {/* Exchange Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">♻️ Exchange Policy</h2>
        <p>
          If you wish to exchange an item for a different size or design, please request an
          exchange within 7 days of delivery. Exchange is subject to product availability.
        </p>
      </section>

      {/* Footer Note */}
      <div className="mt-10 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <p className="text-sm text-gray-800">
          💡 <strong>Tip:</strong> Please keep your invoice and original packaging
          safe until the return/refund process is complete.
        </p>
      </div>
    </div>
  );
}
