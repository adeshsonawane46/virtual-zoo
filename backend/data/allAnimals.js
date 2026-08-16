const mammals = require("./animalsData");
const reptiles = require("./reptilesData");
const amphibians = require("./amphibiansData");
const fish = require("./fishData");
const insects = require("./insectsData");

// Extract mammals if it contains full list or birds
let mammalList = Array.isArray(mammals) ? mammals : [];

const allAnimals = [
  ...mammalList,
  ...reptiles,
  ...amphibians,
  ...fish,
  ...insects
];

module.exports = allAnimals;
