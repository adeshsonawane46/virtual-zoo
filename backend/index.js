require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Models & Data
const Animal = require("./models/Animal");
const QuizQuestion = require("./models/QuizQuestion");
const allAnimalsData = require("./data/allAnimals");
const { generateGeminiQuiz } = require("./services/geminiService");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const soundRoute = require("./server/api/sound");

const app = express();
const PORT = process.env.PORT || 5001;

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ---------------- DATABASE ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.warn("MongoDB Connection Note:", err.message));

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/sound", soundRoute);

// ---------------- ANIMAL ROUTES ----------------
app.get("/api/animals", async (req, res) => {
  try {
    const { category } = req.query;
    let animals = [];

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (category) {
        query.category = { $regex: `^${category}$`, $options: "i" };
      }
      animals = await Animal.find(query).lean();
    }

    // Fallback to dataset if DB returns empty
    if (!animals || animals.length === 0) {
      animals = allAnimalsData.filter(a => {
        if (!category) return true;
        return a.category.toLowerCase() === category.toLowerCase();
      });
    }

    res.json(animals);
  } catch (err) {
    console.error("Fetch animals error:", err);
    // Fallback to static dataset
    const { category } = req.query;
    const fallback = allAnimalsData.filter(a => !category || a.category.toLowerCase() === category.toLowerCase());
    res.json(fallback);
  }
});

app.get("/api/animals/:id", async (req, res) => {
  try {
    let animal = null;
    if (mongoose.connection.readyState === 1) {
      animal = await Animal.findOne({ id: req.params.id }).lean();
    }
    if (!animal) {
      animal = allAnimalsData.find(a => a.id === req.params.id || a.name.toLowerCase() === req.params.id.toLowerCase());
    }
    if (!animal) {
      return res.status(404).json({ message: "Animal not found" });
    }
    res.json(animal);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch animal" });
  }
});

// ---------------- GEMINI API QUIZ ROUTE ----------------
app.get("/api/quiz/generate-gemini", async (req, res) => {
  try {
    const { animal, category } = req.query;
    if (!animal) {
      return res.status(400).json({ message: "Animal parameter is required" });
    }

    console.log(`Generating 10 Gemini MCQs for animal: ${animal} (Category: ${category})`);
    const mcqs = await generateGeminiQuiz(animal, category);
    res.json({ animal, category, questions: mcqs });
  } catch (err) {
    console.error("Gemini quiz generation error:", err);
    res.status(500).json({ message: "Failed to generate Gemini quiz" });
  }
});

// POST version of Gemini API quiz generation
app.post("/api/quiz/generate-gemini", async (req, res) => {
  try {
    const { animal, category } = req.body;
    if (!animal) {
      return res.status(400).json({ message: "Animal parameter is required" });
    }

    const mcqs = await generateGeminiQuiz(animal, category);
    res.json({ animal, category, questions: mcqs });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate Gemini quiz" });
  }
});

// Legacy quiz route
app.get("/api/quiz", async (req, res) => {
  try {
    const { category, animal } = req.query;
    if (animal) {
      const mcqs = await generateGeminiQuiz(animal, category);
      return res.json(mcqs);
    }
    let filter = {};
    if (category) filter.category = { $regex: `^${category}$`, $options: "i" };

    const questions = await QuizQuestion.find(filter).lean();
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: "Quiz fetch error" });
  }
});

// ---------------- HEALTH CHECK ----------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;