const axios = require("axios");

/**
 * Generate 10 MCQs directly from Gemini API for a specified animal.
 */
async function generateGeminiQuiz(animalName, categoryName) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    const prompt = `You are a wildlife expert creating an engaging 10-question multiple choice quiz for a Virtual Zoo app about the animal "${animalName}" (${categoryName || 'Wildlife'}).
Generate EXACTLY 10 multiple-choice questions (MCQs).
Return ONLY a valid raw JSON array of 10 objects. Do not include markdown code block formatting (no \`\`\`json).
Each object MUST strictly have these properties:
{
  "id": 1,
  "question": "Clear educational question about ${animalName}?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "Exact matching string from options array",
  "explanation": "1 short interesting fact explaining why this answer is correct."
}`;

    try {
      // Try gemini-1.5-flash endpoint first
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
      const response = await axios.post(
        geminiUrl,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        },
        { headers: { "Content-Type": "application/json" }, timeout: 12000 }
      );

      const rawText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const cleanedText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed) && parsed.length >= 5) {
          return parsed.slice(0, 10).map((item, idx) => ({
            id: item.id || idx + 1,
            question: item.question,
            options: item.options,
            correctAnswer: item.correctAnswer,
            explanation: item.explanation || `Learn more about ${animalName}!`
          }));
        }
      }
    } catch (err) {
      console.warn(`Gemini API call failed for ${animalName}:`, err.message);
    }
  }

  // Smart dynamic fallback if API key is not present or request fails
  return generateDynamicFallbackQuiz(animalName, categoryName);
}

/**
 * Generates 10 structured MCQs dynamically for any animal
 */
function generateDynamicFallbackQuiz(animal, category = "Wildlife") {
  const cat = (category || "Wildlife").toUpperCase();

  const questionTemplates = [
    {
      q: `What primary biological class does the ${animal} belong to?`,
      opts: [cat, "INSECT", "AMPHIBIAN", "FISH"].filter((v, i, a) => a.indexOf(v) === i),
      ans: cat,
      exp: `The ${animal} is classified under ${cat}.`
    },
    {
      q: `What type of diet does the ${animal} primarily consume in its natural habitat?`,
      opts: ["Herbivore", "Carnivore", "Omnivore", "Insectivore"],
      ans: cat === "MAMMAL" || cat === "REPTILE" ? "Carnivore" : (cat === "BIRD" ? "Omnivore" : "Herbivore"),
      exp: `The ${animal}'s diet is specially adapted to its native ecosystem.`
    },
    {
      q: `Where is the native geographical range of the ${animal}?`,
      opts: ["Tropical Rainforests & Savannas", "Arctic Tundra", "Deep Ocean Trenches", "Urban Deserts"],
      ans: "Tropical Rainforests & Savannas",
      exp: `The ${animal} thrives in rich natural biodiverse habitats.`
    },
    {
      q: `Which unique physical feature helps the ${animal} survive in the wild?`,
      opts: ["Specialized Camouflage & Adaptations", "Bioluminescent Wings", "Gills that process lava", "Metallic scales"],
      ans: "Specialized Camouflage & Adaptations",
      exp: `Evolutionary adaptations give the ${animal} an edge against predators and prey.`
    },
    {
      q: `What is the current general conservation status of species like the ${animal}?`,
      opts: ["Vulnerable / Threatened", "Least Concern", "Extinct in Wild", "Unknown"],
      ans: "Vulnerable / Threatened",
      exp: `Habitat preservation efforts are crucial for sustaining ${animal} populations.`
    },
    {
      q: `How does the ${animal} primarily communicate or interact with others of its species?`,
      opts: ["Vocalizations & Pheromones", "Radio Frequencies", "Color-changing flashes", "Telepathy"],
      ans: "Vocalizations & Pheromones",
      exp: `Communication plays a vital role in social structure and mating for ${animal}.`
    },
    {
      q: `What is a major environmental threat to the ${animal}'s wild habitat?`,
      opts: ["Deforestation & Climate Change", "Over-freezing", "Space Debris", "Volcanic Ash"],
      ans: "Deforestation & Climate Change",
      exp: `Human expansion and climate shifts impact the habitats of species like ${animal}.`
    },
    {
      q: `How does the ${animal} protect itself when threatened by natural predators?`,
      opts: ["Swift locomotion or defensive armor", "Flying to space", "Burrowing 50 miles deep", "Hypnotizing predators"],
      ans: "Swift locomotion or defensive armor",
      exp: `The ${animal} relies on quick reflexes, stealth, or natural defenses.`
    },
    {
      q: `During which time of day is the ${animal} typically most active?`,
      opts: ["Diurnal or Nocturnal based on sub-species", "Only at Solar Eclipse", "During blizzards", "Strictly at midnight"],
      ans: "Diurnal or Nocturnal based on sub-species",
      exp: `Activity cycles for ${animal} align with foraging and temperature balance.`
    },
    {
      q: `Why is the ${animal} considered an important part of its ecosystem?`,
      opts: ["Maintains ecological balance as a key species", "Regulates planetary gravity", "Produces electricity for forests", "Prevents earthquakes"],
      ans: "Maintains ecological balance as a key species",
      exp: `Every creature like the ${animal} contributes to food web stability.`
    }
  ];

  return questionTemplates.map((t, idx) => ({
    id: idx + 1,
    question: t.q,
    options: shuffleArray(t.opts.length === 4 ? t.opts : [t.ans, "Herbivore", "Carnivore", "Insectivore"]),
    correctAnswer: t.ans,
    explanation: t.exp
  }));
}

function shuffleArray(arr) {
  const array = [...arr];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

module.exports = { generateGeminiQuiz };
