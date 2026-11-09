// eBay fee schedules (eBay.com without a Store, and eBay.co.uk).
// Checked against eBay's help pages on `verifiedOn`.

/**
 * marginal: each rate applies only to the slice of the sale inside its band
 *           (e.g. 13.6% on the first $7,500, 2.35% on the rest).
 * whole:    one rate for the whole sale, picked by which band the sale falls in
 *           (e.g. handbags: 15% if $2,000 or less, 9% if more).
 */
export type Tier = { upTo: number; rate: number };
export type EbayCategory = {
  id: string;
  name: string;
  mode: "marginal" | "whole";
  tiers: Tier[];
  /** Compare thresholds with the item price instead of the total sale. */
  thresholdOnItem?: boolean;
  /** Category-specific rule that removes the per-order fee above a price. */
  noOrderFeeFrom?: number;
};

const INF = Number.POSITIVE_INFINITY;

export const EBAY_US = {
  verifiedOn: "2026-11-09",
  currency: "USD" as const,
  orderFee: { smallOrderMax: 10, small: 0.3, standard: 0.4 },
  internationalRate: 0.0165,
  belowStandardExtra: 0.06,
  freeListings: 250,
  insertionFee: 0.35,
  sources: [{ label: "eBay.com Help: Selling fees (sellers without a Store)", url: "https://www.ebay.com/help/selling/fees-credits-invoices/selling-fees?id=4822" }],
  categories: [
    { id: "most", name: "Most categories", mode: "marginal", tiers: [{ upTo: 7500, rate: 0.136 }, { upTo: INF, rate: 0.0235 }] },
    { id: "books", name: "Books, Movies & TV, Music", mode: "marginal", tiers: [{ upTo: 7500, rate: 0.153 }, { upTo: INF, rate: 0.0235 }] },
    { id: "cards", name: "Trading cards & comics", mode: "marginal", tiers: [{ upTo: 7500, rate: 0.1325 }, { upTo: INF, rate: 0.0235 }] },
    { id: "coins", name: "Coins & paper money", mode: "marginal", tiers: [{ upTo: 7500, rate: 0.1325 }, { upTo: INF, rate: 0.0235 }] },
    { id: "bullion", name: "Bullion", mode: "whole", tiers: [{ upTo: 7500, rate: 0.136 }, { upTo: INF, rate: 0.07 }] },
    { id: "handbags", name: "Women's bags & handbags", mode: "whole", tiers: [{ upTo: 2000, rate: 0.15 }, { upTo: INF, rate: 0.09 }] },
    { id: "jewelry", name: "Jewelry (not watches)", mode: "whole", tiers: [{ upTo: 5000, rate: 0.15 }, { upTo: INF, rate: 0.09 }] },
    { id: "watches", name: "Watches, parts & accessories", mode: "marginal", tiers: [{ upTo: 1000, rate: 0.15 }, { upTo: 7500, rate: 0.065 }, { upTo: INF, rate: 0.03 }] },
    { id: "guitars", name: "Guitars & basses", mode: "marginal", tiers: [{ upTo: 7500, rate: 0.067 }, { upTo: INF, rate: 0.0235 }] },
    {
      id: "sneakers",
      name: "Athletic shoes",
      mode: "whole",
      thresholdOnItem: true,
      noOrderFeeFrom: 150,
      tiers: [{ upTo: 149.99, rate: 0.136 }, { upTo: INF, rate: 0.08 }],
    },
    { id: "heavy", name: "Heavy equipment & food trucks", mode: "marginal", tiers: [{ upTo: 15000, rate: 0.03 }, { upTo: INF, rate: 0.005 }] },
    { id: "nft", name: "NFTs", mode: "marginal", tiers: [{ upTo: INF, rate: 0.05 }] },
  ] satisfies EbayCategory[],
};

export type UkRegion = "UK" | "EU" | "USCA" | "OTHER";

export const EBAY_UK = {
  verifiedOn: "2026-11-09",
  currency: "GBP" as const,
  business: {
    orderFee: { smallOrderMax: 10, small: 0.3, standard: 0.4 },
    regulatoryRate: 0.0035,
    vatRate: 0.2,
    international: { UK: 0, EU: 0.0105, USCA: 0.018, OTHER: 0.02 } as Record<UkRegion, number>,
    belowStandardExtra: 0.06,
  },
  privateSeller: {
    // UK-based private sellers pay no final value or regulatory fee (except vehicles), since 1 Oct 2024.
    internationalRate: 0.03,
    freeListings: 300,
    insertionFee: 0.35,
  },
  sources: [
    { label: "eBay.co.uk Help: Fees for business sellers (updated 5 Nov 2026)", url: "https://www.ebay.co.uk/help/selling/fees-credits-invoices/fees-business-sellers-activated-managed-payments?id=4809" },
    { label: "eBay.co.uk Help: Fees for private sellers", url: "https://www.ebay.co.uk/help/selling/fees-credits-invoices/selling-fees?id=4364" },
    { label: "eBay UK Seller Centre: selling is free for private sellers", url: "https://www.ebay.co.uk/sellercentre/selling/fees/?targetgroup=C2C" },
  ],
  categories: [
    { id: "everything", name: "Everything else", mode: "marginal", tiers: [{ upTo: INF, rate: 0.129 }] },
    { id: "antiques", name: "Antiques, Art, Baby, Dolls", mode: "marginal", tiers: [{ upTo: INF, rate: 0.109 }] },
    { id: "books", name: "Books, Comics & Magazines", mode: "marginal", tiers: [{ upTo: INF, rate: 0.099 }] },
    { id: "business", name: "Business, Office & Industrial", mode: "marginal", tiers: [{ upTo: INF, rate: 0.125 }] },
    { id: "cameras", name: "Cameras & Photography", mode: "marginal", tiers: [{ upTo: INF, rate: 0.099 }] },
    { id: "cameras-gear", name: "Cameras, lenses & camcorders", mode: "marginal", tiers: [{ upTo: 1000, rate: 0.069 }, { upTo: INF, rate: 0.03 }] },
    { id: "clothes", name: "Clothes, Shoes & Accessories", mode: "marginal", tiers: [{ upTo: INF, rate: 0.119 }] },
    { id: "handbags", name: "Women's bags & handbags", mode: "marginal", tiers: [{ upTo: 800, rate: 0.129 }, { upTo: INF, rate: 0.07 }] },
    { id: "trainers", name: "Trainers", mode: "whole", thresholdOnItem: true, tiers: [{ upTo: 99.99, rate: 0.119 }, { upTo: INF, rate: 0.07 }] },
    { id: "coins", name: "Coins", mode: "marginal", tiers: [{ upTo: 450, rate: 0.109 }, { upTo: INF, rate: 0.03 }] },
    { id: "collectables", name: "Collectables, Stamps, Sports", mode: "marginal", tiers: [{ upTo: INF, rate: 0.109 }] },
    { id: "computers", name: "Computers & Networking", mode: "marginal", tiers: [{ upTo: INF, rate: 0.099 }] },
    { id: "laptops", name: "Laptops, desktops, tablets", mode: "marginal", tiers: [{ upTo: 1000, rate: 0.069 }, { upTo: INF, rate: 0.03 }] },
    { id: "crafts", name: "Crafts", mode: "marginal", tiers: [{ upTo: INF, rate: 0.129 }] },
    { id: "garden", name: "Garden, Beauty, Sporting goods", mode: "marginal", tiers: [{ upTo: INF, rate: 0.109 }] },
    { id: "home", name: "Home, Furniture & DIY", mode: "marginal", tiers: [{ upTo: 500, rate: 0.119 }, { upTo: INF, rate: 0.079 }] },
    { id: "appliances", name: "Appliances & DIY tools", mode: "marginal", tiers: [{ upTo: 400, rate: 0.069 }, { upTo: INF, rate: 0.03 }] },
    { id: "furniture", name: "Furniture, bath & plumbing", mode: "marginal", tiers: [{ upTo: 500, rate: 0.109 }, { upTo: 1000, rate: 0.079 }, { upTo: INF, rate: 0.03 }] },
    { id: "jewellery", name: "Jewellery (general)", mode: "marginal", tiers: [{ upTo: 1000, rate: 0.149 }, { upTo: INF, rate: 0.04 }] },
    { id: "watches", name: "Watches & parts", mode: "marginal", tiers: [{ upTo: 750, rate: 0.129 }, { upTo: INF, rate: 0.03 }] },
    { id: "phones", name: "Mobile & smart phones", mode: "marginal", tiers: [{ upTo: 1000, rate: 0.069 }, { upTo: INF, rate: 0.03 }] },
    { id: "phone-acc", name: "Phone accessories", mode: "marginal", tiers: [{ upTo: INF, rate: 0.099 }] },
    { id: "music", name: "Music, Films & TV", mode: "marginal", tiers: [{ upTo: INF, rate: 0.099 }] },
    { id: "tv-audio", name: "TVs, headphones & hi-fi", mode: "marginal", tiers: [{ upTo: 1000, rate: 0.069 }, { upTo: INF, rate: 0.03 }] },
    { id: "instruments", name: "Musical instruments & DJ", mode: "marginal", tiers: [{ upTo: INF, rate: 0.109 }] },
    { id: "pets", name: "Pet supplies", mode: "marginal", tiers: [{ upTo: INF, rate: 0.129 }] },
    { id: "toys", name: "Toys & Games", mode: "marginal", tiers: [{ upTo: INF, rate: 0.109 }] },
    { id: "vehicle-parts", name: "Vehicle parts & accessories", mode: "marginal", tiers: [{ upTo: 750, rate: 0.095 }, { upTo: INF, rate: 0.03 }] },
    { id: "video-games", name: "Video games & accessories", mode: "marginal", tiers: [{ upTo: INF, rate: 0.099 }] },
    { id: "consoles", name: "Video game consoles", mode: "marginal", tiers: [{ upTo: 400, rate: 0.069 }, { upTo: INF, rate: 0.02 }] },
  ] satisfies EbayCategory[],
};
