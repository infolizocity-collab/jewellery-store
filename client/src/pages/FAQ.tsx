import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const faqs: FAQItem[] = [
  {
    question: "What is the delivery time?",
    answer:
      "Our standard delivery time is 4–7 business days across India. Express shipping is also available at checkout.",
  },
  {
    question: "Do you provide a warranty?",
    answer:
      "Yes! All our jewellery comes with a 1-year warranty covering manufacturing defects.",
  },
  {
    question: "Is cash on delivery (COD) available?",
    answer:
      "Yes, COD is available in most pin codes. You can select COD while placing your order.",
  },
  {
    question: "What is your return policy?",
    answer:
      "You can return unused items within 7 days of delivery for a full refund or exchange.",
  },
  {
    question: "Are your products hallmarked?",
    answer:
      "All gold jewellery is BIS hallmarked and certified for purity.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-center mb-10 text-yellow-600">
        Frequently Asked Questions
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl shadow-sm"
          >
            <button
              onClick={() => toggle(i)}
              className="w-full flex justify-between items-center p-4 text-left text-lg font-medium hover:bg-yellow-50 transition"
            >
              {faq.question}
              <span className="text-2xl">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className="px-4 pb-4 text-gray-700">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
