const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/", async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await axios.post(
      "https://api.elevenlabs.io/v1/sound-generation",
      { text: prompt },
      {
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json"
        },
        responseType: "arraybuffer"
      }
    );

    res.set("Content-Type", "audio/mpeg");
    res.send(result.data);
  } catch (error) {
    console.error("Sound API error:", error.message);
    res.status(500).json({ error: "Sound generation failed" });
  }
});

module.exports = router;
