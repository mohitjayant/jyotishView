import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Express
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory waitlist DB
const waitlistEmails: Array<{ email: string; joinedAt: string; position: number }> = [];

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (apiKey) {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } else {
    console.warn("GEMINI_API_KEY environment variable is not defined. AI features will run in fallback demo mode.");
  }
} catch (err) {
  console.error("Error initializing Gemini API:", err);
}

// 1. Waitlist API
app.post("/api/waitlist", (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const normalized = email.trim().toLowerCase();
  const existing = waitlistEmails.find((item) => item.email === normalized);

  if (existing) {
    return res.json({
      success: true,
      message: "You're already on the celestial waitlist!",
      position: existing.position,
      totalCount: waitlistEmails.length,
    });
  }

  const position = waitlistEmails.length + 50432; // starts at high number for stellar effect
  const newEntry = {
    email: normalized,
    joinedAt: new Date().toISOString(),
    position,
  };
  waitlistEmails.push(newEntry);

  return res.json({
    success: true,
    message: "Welcome to Jyotish9! You have successfully secured your early spot.",
    position,
    totalCount: waitlistEmails.length + 50431,
  });
});

// Helper: Calculate mockup-but-consistent house positions based on DOB, TOB
// Vedic astrology uses 12 houses. This helper yields consistent, delightful charts.
function calculateVedicKundli(dob: string, tob: string, name: string) {
  // Use sum of characters and date digits to seed random-but-deterministic values
  const seedStr = `${dob}-${tob}-${name.toLowerCase().trim()}`;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed += seedStr.charCodeAt(i);
  }

  const planets = [
    { name: "Lagna (Ascendant)", key: "Asc", symbol: "ASC" },
    { name: "Surya (Sun)", key: "Su", symbol: "☉" },
    { name: "Chandra (Moon)", key: "Mo", symbol: "☽" },
    { name: "Mangal (Mars)", key: "Ma", symbol: "♂" },
    { name: "Budha (Mercury)", key: "Me", symbol: "☿" },
    { name: "Guru (Jupiter)", key: "Ju", symbol: "♃" },
    { name: "Shukra (Venus)", key: "Ve", symbol: "♀" },
    { name: "Shani (Saturn)", key: "Sa", symbol: "♄" },
    { name: "Rahu (North Node)", key: "Ra", symbol: "☊" },
    { name: "Ketu (South Node)", key: "Ke", symbol: "☋" },
  ];

  const zodiacSigns = [
    "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
    "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
  ];

  const nakshatras = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
    "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta",
    "Chitra", "Svati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha",
    "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada",
    "Uttara Bhadrapada", "Revati"
  ];

  // Assign deterministic houses (1 to 12) and degrees (0 to 30)
  const results = planets.map((planet, index) => {
    const planetSeed = seed + index * 17;
    const house = (planetSeed % 12) + 1;
    const degree = (planetSeed % 300) / 10;
    const signIndex = (house + (seed % 12) - 1) % 12;
    const nakshatraIndex = (planetSeed % 27);
    const pada = (planetSeed % 4) + 1;

    return {
      name: planet.name,
      key: planet.key,
      symbol: planet.symbol,
      house,
      degree: degree.toFixed(2),
      sign: zodiacSigns[signIndex],
      nakshatra: nakshatras[nakshatraIndex],
      pada,
    };
  });

  // Ascendant sets the 1st House. We'll identify which zodiac sign is the lagna
  const lagnaHouse = results[0];
  const moonHouse = results[2]; // Chandra
  const sunHouse = results[1]; // Surya

  return {
    lagnaSign: lagnaHouse.sign,
    moonNakshatra: moonHouse.nakshatra,
    moonSign: moonHouse.sign,
    sunSign: sunHouse.sign,
    placements: results,
  };
}

// 2. Horoscope API (Gemini assisted or fallback)
app.post("/api/horoscope", async (req, res) => {
  const { sign, category } = req.body;
  if (!sign || !category) {
    return res.status(400).json({ error: "Zodiac sign and category are required." });
  }

  const prompt = `You are a legendary Vedic astrologer. Generate an insightful and poetic daily horoscope prediction for the Zodiac sign "${sign}" in the category of "${category}". Combine ancient Indian astronomical wisdom (Jyotish) with practical modern self-actualization advice. Include a cosmic power tip or gemstone suggestion. Keep the response elegant, inspiring, structured, and around 180 words.`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.82,
        }
      });

      const prediction = response.text || "The stars are in a divine configuration. Keep aiming high.";
      return res.json({ sign, category, prediction, source: "Gemini-3.5" });
    } catch (err: any) {
      console.error("Gemini failed to generate daily horoscope:", err);
      // Fallback to offline template engine on failure
    }
  }

  // Pure Offline High-Quality Astrological prediction generator if Gemini not available
  const quotes = [
    `Guru (Jupiter) casts a highly beneficial aspect on your house of action. A long-pending aspiration will find immediate alignment this week. Avoid haste, and wear gold or yellow colors for divine protection.`,
    `Surya (The Sun) moves into your solar quadrant, invigorating your vital energy (Prana). It is an excellent cosmic moment to begin pioneering ventures, though Shani (Saturn) suggests strict discipline is required.`,
    `Chandra (The Moon) glides through a mystical Nakshatra in your chart, sparking vivid dreams, deeper intuition, and emotional healing. Spend quiet moments near water or meditation.`,
    `Shukra (Venus) blesses your interpersonal field, bringing an aura of golden warmth, charm, and peaceful resolutions. Reconnect with a kindred soul and express appreciation.`
  ];

  const pick = quotes[(sign.length + category.length) % quotes.length];
  return res.json({
    sign,
    category,
    prediction: `[DEMO MODE] ${pick} As you walk your celestial path, remember that you are the architect of your own destiny. Stars guide you; intention propels you.`,
    source: "Jyotish9 Engine",
  });
});

// 3. Complete Vedic Chart interpretation (Gemini assisted or fallback)
app.post("/api/kundli", async (req, res) => {
  const { name, date, time, location } = req.body;
  if (!name || !date || !time) {
    return res.status(400).json({ error: "Name, date, and time of birth are required." });
  }

  // Calculate correct mockup planets
  const chart = calculateVedicKundli(date, time, name);

  let interpreterText = "";
  if (ai) {
    try {
      const prompt = `You are an elite Vedic Astrology (Jyotish) Master. Interpret this calculated Kundli chart details for a seeker named "${name}".
Birth Details: Date: ${date}, Time: ${time}, Place: ${location || "Unspecified Coordinates"}.
Calculated Alignments:
- Lagna/Ascendant Sign: ${chart.lagnaSign}
- Surya (Sun) Sign: ${chart.sunSign}
- Chandra (Moon) Sign: ${chart.moonSign}
- Chandra Nakshatra (Star): ${chart.moonNakshatra}

Provide an authentic:
1. "Personality Core & Ascendant Essence" (approx 80 words)
2. "Soul Purpose (Sun Alignment) & Emotional Compass (Moon Alignment)" (approx 80 words)
3. "Key Planetary Yoga / Life Lesson" (approx 80 words)
4. "Mantra or Gemstone Recommendation" (approx 30 words)

Speak with warmth, deep spiritual intuition, and encouraging wisdom. Do not use markdown headers like H1 or H2, use bullet points or clean paragraphs instead.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.76,
        }
      });

      interpreterText = response.text || "";
    } catch (err) {
      console.error("Gemini failed to interpret Kundli:", err);
    }
  }

  if (!interpreterText) {
    interpreterText = `Dear ${name}, your birth charts reveals a beautiful connection with the cosmos. Having ${chart.lagnaSign} as your ascending dawn force suggests you carry a powerful aura of initiative. Your mind is guided by ${chart.moonSign} under the mystical Nakshatra of ${chart.moonNakshatra}, granting you emotional depth and sharp intuitive instincts. The placement of Surya in ${chart.sunSign} aligns your path with persistent growth and spiritual self-realized leadership.

Planetary Remedies: Combine meditation on the Sun (Surya Namaskar) with wearing natural earth tones on Thursdays to fortify your planetary ruler and unlock greater abundance.`;
  }

  return res.json({
    success: true,
    chart,
    interpretation: interpreterText,
  });
});

// 4. Kundli Matching (Ashta Koota Compatibility Score)
app.post("/api/matchmake", (req, res) => {
  const { partner1, partner2 } = req.body;
  if (!partner1 || !partner2) {
    return res.status(400).json({ error: "Both partners' zodiac signs are required." });
  }

  const zodiacs = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];

  const idx1 = zodiacs.indexOf(partner1);
  const idx2 = zodiacs.indexOf(partner2);

  // Generate a realistic but positive calculation out of 36 points (Ashta Koota system)
  let baseScore = 18; // standard neutral score
  const diff = Math.abs(idx1 - idx2);

  if (diff === 0) {
    baseScore = 28; // Excellent match (Same sign)
  } else if (diff === 4 || diff === 8) {
    baseScore = 32; // Golden Triplicity (Very high harmony)
  } else if (diff === 3 || diff === 9) {
    baseScore = 24; // Good placement
  } else if (diff === 6) {
    baseScore = 15; // Samasaptaka (Intense attraction, needs adjustment)
  } else {
    baseScore = 20 + (diff % 7);
  }

  const scorePercentage = Math.round((baseScore / 36) * 100);

  let guidance = "";
  if (scorePercentage >= 80) {
    guidance = "Divine Union: An exceptional alignment. Your Moon elements harmonise fluidly, ensuring deep emotional resonance, shared values, and mutual support on the spiritual path.";
  } else if (scorePercentage >= 60) {
    guidance = "Harmonious Bond: A stable and complementary relationship. Communication flows well, though slight differences in emotional rhythms can be easily transcended through mutual respect.";
  } else {
    guidance = "Complementary Growth: This union demands conscious maturity and open communication. You have unique planetary lenses, creating opportunities for profound personal evolution.";
  }

  return res.json({
    kootaPoints: baseScore,
    maxPoints: 36,
    percentage: scorePercentage,
    guidance,
    elements: {
      partner1Element: ["Fire", "Earth", "Air", "Water"][idx1 % 4],
      partner2Element: ["Fire", "Earth", "Air", "Water"][idx2 % 4],
    }
  });
});

// Start routing config
async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
