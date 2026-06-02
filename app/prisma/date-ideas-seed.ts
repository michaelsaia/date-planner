/**
 * Seed data: curated date ideas with activities.
 * Each idea maps to interest categories for matching.
 */

export type SeedDateIdea = {
  title: string;
  description: string;
  mood: string;
  estimatedCost: number;
  surprise: string;
  relatedInterests: string[]; // Interest names for matching
  activities: {
    name: string;
    venueName: string;
    venueUrl: string | null;
    mapsUrl: string | null;
    order: number;
  }[];
};

export const DATE_IDEAS: SeedDateIdea[] = [
  // ── Romantic ──
  {
    title: "Candlelit Italian Evening",
    description:
      "A classic romantic night starting with a cozy Italian dinner, followed by a moonlit walk through the park with a surprise stop for gelato.",
    mood: "romantic",
    estimatedCost: 90,
    surprise: "Write a short love note on the napkin before dessert arrives.",
    relatedInterests: ["Fine Dining", "Cooking"],
    activities: [
      { name: "Dinner at an Italian restaurant", venueName: "Local Italian Bistro", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Moonlit park walk", venueName: "Nearby Park", venueUrl: null, mapsUrl: null, order: 2 },
      { name: "Gelato stop", venueName: "Gelato Shop", venueUrl: null, mapsUrl: null, order: 3 },
    ],
  },
  {
    title: "Sunset Picnic & Stargazing",
    description:
      "Pack a gourmet picnic basket, find a quiet hilltop or lakeside spot, and watch the sunset transition into a starlit sky together.",
    mood: "romantic",
    estimatedCost: 35,
    surprise: "Bring a Bluetooth speaker with a playlist of songs from when you first started dating.",
    relatedInterests: ["Stargazing", "Cooking", "Beach"],
    activities: [
      { name: "Prepare picnic basket", venueName: "Home Kitchen", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Sunset watching", venueName: "Local Scenic Overlook", venueUrl: null, mapsUrl: null, order: 2 },
      { name: "Stargazing", venueName: "Same spot after dark", venueUrl: null, mapsUrl: null, order: 3 },
    ],
  },
  {
    title: "Wine & Paint Night",
    description:
      "Sip wine while painting side by side at a local studio. Compare your masterpieces at the end and take them home as keepsakes.",
    mood: "romantic",
    estimatedCost: 70,
    surprise: "Secretly paint a small heart somewhere in your canvas for them to discover later.",
    relatedInterests: ["Wine Tasting", "Art Galleries", "Photography"],
    activities: [
      { name: "Wine & paint session", venueName: "Local Paint Studio", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Wine bar nightcap", venueName: "Nearby Wine Bar", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },

  // ── Adventurous ──
  {
    title: "Sunrise Hike & Brunch",
    description:
      "Wake up early for a scenic trail hike to catch the sunrise, then reward yourselves with a hearty brunch at a nearby cafe.",
    mood: "adventurous",
    estimatedCost: 45,
    surprise: "Pack a thermos of their favorite hot drink to share at the summit.",
    relatedInterests: ["Hiking", "Cycling", "Farmers Market"],
    activities: [
      { name: "Sunrise hike", venueName: "Local Trail / State Park", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Post-hike brunch", venueName: "Nearby Brunch Cafe", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Bike & Explore New Neighborhood",
    description:
      "Rent bikes and explore a neighborhood you have never been to. Pop into quirky shops, try street food, and see where the road takes you.",
    mood: "adventurous",
    estimatedCost: 40,
    surprise: "Challenge each other to find the most unusual item in a thrift store for under $5.",
    relatedInterests: ["Cycling", "Photography", "Farmers Market"],
    activities: [
      { name: "Bike rental", venueName: "Local Bike Shop", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Neighborhood exploration", venueName: "New Neighborhood", venueUrl: null, mapsUrl: null, order: 2 },
      { name: "Street food tasting", venueName: "Local Street Food Spot", venueUrl: null, mapsUrl: null, order: 3 },
    ],
  },
  {
    title: "Kayaking & Waterfront Dinner",
    description:
      "Spend the afternoon kayaking on a lake or river, then dry off and enjoy a waterfront dinner as the sun sets.",
    mood: "adventurous",
    estimatedCost: 110,
    surprise: "Bring waterproof phone cases and take silly selfies on the water.",
    relatedInterests: ["Beach", "Hiking"],
    activities: [
      { name: "Kayak rental & paddle", venueName: "Local Kayak Outfitter", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Waterfront dinner", venueName: "Lakeside Restaurant", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },

  // ── Low-key ──
  {
    title: "Board Game Cafe Marathon",
    description:
      "Spend a rainy afternoon at a board game cafe. Try new games, sip hot chocolate, and see who comes out on top.",
    mood: "low-key",
    estimatedCost: 25,
    surprise: "Bring a small trophy or gold star stickers for the winner of each round.",
    relatedInterests: ["Board Games", "Escape Room"],
    activities: [
      { name: "Board game cafe visit", venueName: "Local Board Game Cafe", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Hot chocolate & dessert", venueName: "Same cafe or nearby bakery", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Movie Marathon & Homemade Popcorn",
    description:
      "Pick a movie trilogy or theme (80s classics, Studio Ghibli, Marvel origin stories) and binge together with homemade gourmet popcorn.",
    mood: "low-key",
    estimatedCost: 15,
    surprise: "Prepare three different gourmet popcorn flavors as a surprise taste test.",
    relatedInterests: ["Movies", "Cooking", "Board Games"],
    activities: [
      { name: "Grocery run for popcorn supplies", venueName: "Local Grocery Store", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Movie marathon", venueName: "Home / Living Room", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Spa Night at Home",
    description:
      "Transform your bathroom into a mini spa. Face masks, bath bombs, calming music, and herbal tea for a deeply relaxing evening together.",
    mood: "low-key",
    estimatedCost: 30,
    surprise: "Buy a new essential oil or bath bomb scent they have never tried.",
    relatedInterests: ["Spa Day", "Yoga"],
    activities: [
      { name: "Shop for spa supplies", venueName: "Local Bath & Body Shop", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "At-home spa session", venueName: "Home Bathroom", venueUrl: null, mapsUrl: null, order: 2 },
      { name: "Herbal tea & relaxation", venueName: "Home / Living Room", venueUrl: null, mapsUrl: null, order: 3 },
    ],
  },

  // ── Foodie ──
  {
    title: "Cook-Off Challenge",
    description:
      "Each partner picks a secret ingredient, then you both have 45 minutes to cook a dish. Taste-test and crown the winner.",
    mood: "foodie",
    estimatedCost: 40,
    surprise: "Print out a silly award certificate for the winning chef.",
    relatedInterests: ["Cooking", "Fine Dining", "Farmers Market"],
    activities: [
      { name: "Ingredient shopping", venueName: "Local Farmers Market or Grocery", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Cook-off at home", venueName: "Home Kitchen", venueUrl: null, mapsUrl: null, order: 2 },
      { name: "Taste test & judging", venueName: "Dining Table", venueUrl: null, mapsUrl: null, order: 3 },
    ],
  },
  {
    title: "Progressive Dinner Crawl",
    description:
      "Plan a three-course dinner across three different restaurants: appetizers at one, entrees at another, and dessert at a third.",
    mood: "foodie",
    estimatedCost: 120,
    surprise: "At each stop, share one favorite memory from your relationship.",
    relatedInterests: ["Fine Dining", "Wine Tasting", "Cooking"],
    activities: [
      { name: "Appetizers", venueName: "Tapas or Small Plates Restaurant", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Main course", venueName: "Local Favorite Restaurant", venueUrl: null, mapsUrl: null, order: 2 },
      { name: "Dessert", venueName: "Dessert Bar or Bakery", venueUrl: null, mapsUrl: null, order: 3 },
    ],
  },
  {
    title: "Farmers Market to Table",
    description:
      "Visit the local farmers market together, pick fresh seasonal ingredients, and cook a meal from scratch at home.",
    mood: "foodie",
    estimatedCost: 50,
    surprise: "Buy a small bouquet of flowers from the market for the table.",
    relatedInterests: ["Farmers Market", "Cooking", "Fine Dining"],
    activities: [
      { name: "Farmers market shopping", venueName: "Local Farmers Market", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Cook together", venueName: "Home Kitchen", venueUrl: null, mapsUrl: null, order: 2 },
      { name: "Candlelit home dinner", venueName: "Dining Room", venueUrl: null, mapsUrl: null, order: 3 },
    ],
  },

  // ── Active ──
  {
    title: "Beach Day & Volleyball",
    description:
      "Hit the beach for swimming, building sandcastles, and a friendly game of volleyball. End with fish tacos at a beachside spot.",
    mood: "active",
    estimatedCost: 35,
    surprise: "Bring a kite to fly together during a break from the water.",
    relatedInterests: ["Beach", "Hiking", "Cycling"],
    activities: [
      { name: "Beach time & volleyball", venueName: "Local Beach", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Fish tacos", venueName: "Beachside Taco Stand", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Partner Yoga & Smoothie Bar",
    description:
      "Try a partner yoga class together, then cool down with fresh smoothies. Great for bonding and a gentle workout.",
    mood: "active",
    estimatedCost: 50,
    surprise: "Book a couples yoga class in advance so it is a surprise reveal.",
    relatedInterests: ["Yoga", "Spa Day"],
    activities: [
      { name: "Partner yoga class", venueName: "Local Yoga Studio", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Smoothie bar visit", venueName: "Nearby Smoothie / Juice Bar", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Bowling & Arcade Night",
    description:
      "A fun, competitive night of bowling followed by classic arcade games. Loser buys milkshakes.",
    mood: "active",
    estimatedCost: 45,
    surprise: "Bring quarters in a fun pouch with a note: 'May the best player win.'",
    relatedInterests: ["Bowling", "Board Games", "Escape Room"],
    activities: [
      { name: "Bowling", venueName: "Local Bowling Alley", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Arcade games", venueName: "Arcade (same venue or nearby)", venueUrl: null, mapsUrl: null, order: 2 },
      { name: "Milkshakes", venueName: "Diner or Milkshake Bar", venueUrl: null, mapsUrl: null, order: 3 },
    ],
  },

  // ── More variety ──
  {
    title: "Live Music & Late Night Diner",
    description:
      "Catch a live band or open mic at a local venue, then keep the night going with classic diner food.",
    mood: "adventurous",
    estimatedCost: 55,
    surprise: "Request their favorite song if the band takes requests.",
    relatedInterests: ["Live Music", "Dancing", "Karaoke"],
    activities: [
      { name: "Live music show", venueName: "Local Music Venue", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Late night diner", venueName: "24-Hour Diner", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Art Gallery Hop & Coffee",
    description:
      "Visit two or three galleries in your area, discuss what you see, and cap off with specialty coffee at a local roaster.",
    mood: "low-key",
    estimatedCost: 20,
    surprise: "Pick a postcard from the gallery gift shop that reminds you of them.",
    relatedInterests: ["Art Galleries", "Photography", "Theater"],
    activities: [
      { name: "Gallery visits", venueName: "Local Art Galleries", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Coffee at a roaster", venueName: "Specialty Coffee Shop", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Escape Room & Tacos",
    description:
      "Test your teamwork in a themed escape room, then celebrate (or commiserate) over tacos and margaritas.",
    mood: "adventurous",
    estimatedCost: 75,
    surprise: "Secretly book the hardest room and see if you can beat the record time.",
    relatedInterests: ["Escape Room", "Board Games"],
    activities: [
      { name: "Escape room challenge", venueName: "Local Escape Room", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Tacos & margaritas", venueName: "Mexican Restaurant", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Karaoke Night Out",
    description:
      "Belt out your favorite duets at a karaoke bar. No judgment, just fun. End with a walk and late-night snacks.",
    mood: "active",
    estimatedCost: 40,
    surprise: "Prepare a secret duet song to surprise them with.",
    relatedInterests: ["Karaoke", "Dancing", "Live Music"],
    activities: [
      { name: "Karaoke session", venueName: "Karaoke Bar", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Late-night snack walk", venueName: "Street Food or Late-Night Spot", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
  {
    title: "Theater Night & Cocktails",
    description:
      "Dress up and enjoy a local theater performance, followed by cocktails at a swanky bar to discuss the show.",
    mood: "romantic",
    estimatedCost: 130,
    surprise: "Leave a small gift (like a book of poetry) on their seat before the show.",
    relatedInterests: ["Theater", "Art Galleries", "Fine Dining"],
    activities: [
      { name: "Theater performance", venueName: "Local Theater", venueUrl: null, mapsUrl: null, order: 1 },
      { name: "Post-show cocktails", venueName: "Cocktail Lounge", venueUrl: null, mapsUrl: null, order: 2 },
    ],
  },
];
