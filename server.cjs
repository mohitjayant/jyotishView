var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;
app.use(import_express.default.json());
var waitlistEmails = [];
var ai = null;
try {
  const apiKey = process.env.GEMINI_API_KEY || "";
  if (apiKey) {
    ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
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
      totalCount: waitlistEmails.length
    });
  }
  const position = waitlistEmails.length + 50432;
  const newEntry = {
    email: normalized,
    joinedAt: (/* @__PURE__ */ new Date()).toISOString(),
    position
  };
  waitlistEmails.push(newEntry);
  return res.json({
    success: true,
    message: "Welcome to Jyotish9! You have successfully secured your early spot.",
    position,
    totalCount: waitlistEmails.length + 50431
  });
});
function calculateVedicKundli(dob, tob, name) {
  const seedStr = `${dob}-${tob}-${name.toLowerCase().trim()}`;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) {
    seed += seedStr.charCodeAt(i);
  }
  const planets = [
    { name: "Lagna (Ascendant)", key: "Asc", symbol: "ASC" },
    { name: "Surya (Sun)", key: "Su", symbol: "\u2609" },
    { name: "Chandra (Moon)", key: "Mo", symbol: "\u263D" },
    { name: "Mangal (Mars)", key: "Ma", symbol: "\u2642" },
    { name: "Budha (Mercury)", key: "Me", symbol: "\u263F" },
    { name: "Guru (Jupiter)", key: "Ju", symbol: "\u2643" },
    { name: "Shukra (Venus)", key: "Ve", symbol: "\u2640" },
    { name: "Shani (Saturn)", key: "Sa", symbol: "\u2644" },
    { name: "Rahu (North Node)", key: "Ra", symbol: "\u260A" },
    { name: "Ketu (South Node)", key: "Ke", symbol: "\u260B" }
  ];
  const zodiacSigns = [
    "Mesha (Aries)",
    "Vrishabha (Taurus)",
    "Mithuna (Gemini)",
    "Karka (Cancer)",
    "Simha (Leo)",
    "Kanya (Virgo)",
    "Tula (Libra)",
    "Vrishchika (Scorpio)",
    "Dhanu (Sagittarius)",
    "Makara (Capricorn)",
    "Kumbha (Aquarius)",
    "Meena (Pisces)"
  ];
  const nakshatras = [
    "Ashwini",
    "Bharani",
    "Krittika",
    "Rohini",
    "Mrigashira",
    "Ardra",
    "Punarvasu",
    "Pushya",
    "Ashlesha",
    "Magha",
    "Purva Phalguni",
    "Uttara Phalguni",
    "Hasta",
    "Chitra",
    "Svati",
    "Vishakha",
    "Anuradha",
    "Jyeshtha",
    "Mula",
    "Purva Ashadha",
    "Uttara Ashadha",
    "Shravana",
    "Dhanishta",
    "Shatabhisha",
    "Purva Bhadrapada",
    "Uttara Bhadrapada",
    "Revati"
  ];
  const results = planets.map((planet, index) => {
    const planetSeed = seed + index * 17;
    const house = planetSeed % 12 + 1;
    const degree = planetSeed % 300 / 10;
    const signIndex = (house + seed % 12 - 1) % 12;
    const nakshatraIndex = planetSeed % 27;
    const pada = planetSeed % 4 + 1;
    return {
      name: planet.name,
      key: planet.key,
      symbol: planet.symbol,
      house,
      degree: degree.toFixed(2),
      sign: zodiacSigns[signIndex],
      nakshatra: nakshatras[nakshatraIndex],
      pada
    };
  });
  const lagnaHouse = results[0];
  const moonHouse = results[2];
  const sunHouse = results[1];
  return {
    lagnaSign: lagnaHouse.sign,
    moonNakshatra: moonHouse.nakshatra,
    moonSign: moonHouse.sign,
    sunSign: sunHouse.sign,
    placements: results
  };
}
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
          temperature: 0.82
        }
      });
      const prediction = response.text || "The stars are in a divine configuration. Keep aiming high.";
      return res.json({ sign, category, prediction, source: "Gemini-3.5" });
    } catch (err) {
      console.error("Gemini failed to generate daily horoscope:", err);
    }
  }
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
    source: "Jyotish9 Engine"
  });
});
app.post("/api/kundli", async (req, res) => {
  const { name, date, time, location } = req.body;
  if (!name || !date || !time) {
    return res.status(400).json({ error: "Name, date, and time of birth are required." });
  }
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
          temperature: 0.76
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
    interpretation: interpreterText
  });
});
app.post("/api/matchmake", (req, res) => {
  const { partner1, partner2 } = req.body;
  if (!partner1 || !partner2) {
    return res.status(400).json({ error: "Both partners' zodiac signs are required." });
  }
  const zodiacs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces"
  ];
  const idx1 = zodiacs.indexOf(partner1);
  const idx2 = zodiacs.indexOf(partner2);
  let baseScore = 18;
  const diff = Math.abs(idx1 - idx2);
  if (diff === 0) {
    baseScore = 28;
  } else if (diff === 4 || diff === 8) {
    baseScore = 32;
  } else if (diff === 3 || diff === 9) {
    baseScore = 24;
  } else if (diff === 6) {
    baseScore = 15;
  } else {
    baseScore = 20 + diff % 7;
  }
  const scorePercentage = Math.round(baseScore / 36 * 100);
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
      partner2Element: ["Fire", "Earth", "Air", "Water"][idx2 % 4]
    }
  });
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
