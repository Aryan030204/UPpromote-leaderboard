import { useState } from "react";

const faqData = [
  {
    question: "How is my rank calculated?",
    answer:
      "Your rank depends on how many successful orders you generate through your affiliate link. Every time someone places an order using your link, you score a point and move up the leaderboard. Think of it like this — the more people you bring in, the higher you climb. Every order counts, and consistency wins!",
  },
  {
    question: "Why does someone with the same orders have a higher rank than me?",
    answer:
      "When two affiliates are tied with the same number of orders, the tiebreaker is simple: speed wins. In case of a tie, the speedster gets the top spot — whoever reached that milestone first secures the higher rank. It keeps the competition fair, fun, and just a little bit thrilling.",
  },
  {
    question: "Do top affiliates get exclusive perks?",
    answer:
      "Oh yes! Top affiliates often unlock special perks such as bonus rewards, higher earnings, early access to campaigns, and premium support. It’s our way of celebrating your performance. The better you play the game, the better the rewards — so keep pushing, because the leaderboard has prizes beyond just bragging rights.",
  },
  {
    question: "Is self-referral allowed?",
    answer:
      "You can technically place an order using your own link, but it won’t count toward your rank or rewards. The system simply ignores self-generated orders to keep things fair for everyone. No penalties, no suspensions — just a gentle reminder that the real wins come from genuinely spreading the word.",
  },
  {
    question: "How often is the leaderboard updated?",
    answer:
      "The leaderboard updates automatically whenever a new order is successfully placed through an affiliate link. So your rank can shift in real-time as the action happens. It’s dynamic, competitive, and always reflecting the latest moves — keep an eye on it, because every new order can change the game.",
  },
  {
    question: "How can I increase my rank quickly?",
    answer:
      "To level up fast, start by sharing your affiliate link across Instagram stories, posts, and reels — social proof works wonders. You can also spread the word through WhatsApp groups, word-of-mouth recommendations, or even short promo videos. And don’t forget your exclusive discount code — people love a deal, and it boosts conversions instantly.",
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="mt-12 bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="bg-[#8B3A3A] px-4 md:px-6 py-4">
        <h2 className="text-xl md:text-2xl font-bold text-white text-center">
          Frequently Asked Questions
        </h2>
      </div>
      <div className="divide-y divide-gray-200">
        {faqData.map((item, index) => (
          <div key={index} className="group">
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-4 md:px-6 py-4 text-left flex justify-between items-center bg-white hover:bg-red-50 transition-colors focus:outline-none"
            >
              <span className="font-semibold text-gray-800 text-base md:text-lg">
                {item.question}
              </span>
              <span
                className={`transform transition-transform duration-200 text-[#8B3A3A] ${openIndex === index ? "rotate-180" : ""
                  }`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="px-4 md:px-6 pb-4 text-sm md:text-base text-gray-700 bg-white">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
