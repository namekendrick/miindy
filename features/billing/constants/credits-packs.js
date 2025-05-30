export const CREDITS_PACKS = [
  {
    id: "SMALL",
    name: "Small Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 999, // $9.99
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID,
  },
  {
    id: "MEDIUM",
    name: "Medium Pack",
    label: "5,000 credits",
    credits: 5000,
    price: 3999, // $39.99
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID,
  },
  {
    id: "LARGE",
    name: "Large Pack",
    label: "10,000 credits",
    credits: 10000,
    price: 6999, // $69.99
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID,
  },
];
