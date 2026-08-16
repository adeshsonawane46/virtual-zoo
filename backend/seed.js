require('dotenv').config();
const mongoose = require('mongoose');
const Animal = require('./models/Animal');
const QuizQuestion = require('./models/QuizQuestion');
const allAnimals = require('./data/allAnimals');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/virtual-zoo';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding');

  console.log(`Upserting ${allAnimals.length} animals across categories...`);

  // Upsert animals
  for (const a of allAnimals) {
    await Animal.updateOne({ id: a.id }, { $set: a }, { upsert: true });
  }

  // Sample static quiz fallback if needed
  const defaultQuiz = [
    { id: 'q1', question: 'Which animal is known as the king of the jungle?', options: ['Lion', 'Tiger', 'Bear', 'Elephant'], correctAnswer: 'Lion', category: 'MAMMAL' }
  ];

  for (const q of defaultQuiz) {
    await QuizQuestion.updateOne({ id: q.id }, { $set: q }, { upsert: true });
  }

  console.log(`Seeding complete! Successfully seeded ${allAnimals.length} animals.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed', err);
  process.exit(1);
});
