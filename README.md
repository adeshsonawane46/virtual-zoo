🦁 Virtual Zoo

An interactive full-stack Virtual Zoo web application where users can explore animals, view detailed information, authenticate securely, and take AI-generated quizzes powered by Google Gemini. The application also provides AI-generated animal sounds using ElevenLabs.

✨ Features

🐾 Browse animals by category

🔎 Search animals

📖 View detailed animal profiles

🌍 View habitat, diet, region, lifespan, and conservation status

🔐 User registration and login

🔑 JWT-based authentication

📧 Forgot password and password reset

🧠 AI-generated 10-question quizzes using Google Gemini

📝 Multiple-choice questions with explanations

🎯 Quiz score tracking

🏆 Leaderboard

🔊 AI-generated animal sounds using ElevenLabs

🖼️ Animal image fallback handling

📱 Responsive user interface

🗄️ MongoDB database integration

🔄 Dynamic fallback quiz generation when Gemini is unavailable

🛠️ Tech Stack

Frontend

React.js

Vite

React Router

Axios

Tailwind CSS

Backend

Node.js

Express.js

MongoDB

Mongoose

JSON Web Token (JWT)

bcryptjs

Nodemailer

Axios

CORS

Cookie Parser

APIs & Services

Google Gemini API — AI quiz generation

ElevenLabs API — animal sound generation

MongoDB Atlas — database

Deployment

Vercel — Frontend

Render — Backend

MongoDB Atlas — Database

📁 Project Structure

Virtual-Zoo/
│
├── backend/
│   ├── data/
│   │   └── allAnimals.js
│   ├── middleware/
│   ├── models/
│   │   ├── Animal.js
│   │   └── QuizQuestion.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── user.js
│   ├── services/
│   │   └── geminiService.js
│   ├── server/
│   │   └── api/
│   │       └── sound.js
│   ├── index.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── ...
│   ├── package.json
│   └── .env.example
│
└── README.md

The sound API is part of the main backend. It is not a separate backend service.

🚀 Getting Started

1. Clone the Repository

git clone https://github.com/adeshsonawane46/virtual-zoo.git
cd virtual-zoo

⚙️ Backend Setup

cd backend
npm install

Create a .env file:

PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL=your_email
EMAIL_PASS=your_email_password
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
FRONTEND_URL=http://localhost:5173

Start the backend:

npm start

Backend:

http://localhost:5001

Seed Database

If database seeding is required:

npm run seed

🎨 Frontend Setup

Open another terminal:

cd frontend
npm install

Create a .env file:

VITE_API_URL=http://localhost:5001
VITE_GOOGLE_CLIENT_ID=your_google_client_id

Start the frontend:

npm run dev

Frontend:

http://localhost:5173

🧠 AI Quiz System

The application uses the Google Gemini API to dynamically generate educational 10-question multiple-choice quizzes based on the selected animal.

Example:

GET /api/quiz/generate-gemini?animal=Lion&category=MAMMAL

Each generated question contains:

Question

Four options

Correct answer

Explanation

If the Gemini API is unavailable, the backend uses a dynamic fallback quiz generator.

🔊 AI Animal Sound Generation

Animal sounds are generated using the ElevenLabs Sound Effects API.

The sound route is part of the main Express backend:

POST /api/sound

Example request:

{
  "prompt": "Lion animal sound"
}

The backend securely communicates with ElevenLabs using the ELEVENLABS_API_KEY environment variable.

The ElevenLabs API key must never be placed in the React frontend or committed to GitHub.

🔐 Authentication

The application provides:

User registration

User login

JWT authentication

Forgot password

Password reset

Protected user features

Quiz score tracking

Leaderboard

The frontend automatically attaches the JWT token to authenticated API requests through an Axios interceptor.

🐾 Animal System

Users can browse animals by category and view individual animal profiles.

Get all animals

GET /api/animals

Get animals by category

GET /api/animals?category=MAMMAL

Get animal by ID

GET /api/animals/:id

Animal information can include:

Name

Scientific name

Description

Image

Category

Habitat

Diet

Size

Lifespan

Region

Conservation status

Primary threats

The backend also includes a static animal dataset that can act as a fallback when the database is unavailable or contains no matching animals.

📡 API Endpoints

Health

GET /api/health

Response:

{
  "status": "ok"
}

Animals

GET /api/animals
GET /api/animals/:id

Authentication

POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password

Quiz

GET /api/quiz
GET /api/quiz/generate-gemini
POST /api/quiz/generate-gemini

User

POST /api/user/quiz-score
GET /api/user/leaderboard

Sound

POST /api/sound

🔑 Environment Variables

Backend

PORT=5001
MONGO_URI=
JWT_SECRET=
EMAIL=
EMAIL_PASS=
GEMINI_API_KEY=
ELEVENLABS_API_KEY=
FRONTEND_URL=

Frontend

VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=

Security

Never commit actual .env files or credentials to GitHub.

Never expose:

MongoDB credentials

JWT secrets

Gemini API keys

ElevenLabs API keys

Email passwords

OAuth credentials

Use .env.example files to document required variables without exposing their values.

🌐 Production Deployment

Frontend — Vercel

Deploy the frontend directory to Vercel.

Add these production environment variables:

VITE_API_URL=https://virtual-zoo-backend-8xmc.onrender.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id

After changing VITE_* environment variables, redeploy the frontend so the values are included in the Vite production build.

Backend — Render

Deploy the backend directory as a Render Web Service.

Build command:

npm install

Start command:

npm start

Add these environment variables in Render:

PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL=your_email
EMAIL_PASS=your_email_password
GEMINI_API_KEY=your_gemini_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
FRONTEND_URL=https://virtual-zoo-view.vercel.app

The same Render backend handles animal data, authentication, user functionality, Gemini quizzes, and ElevenLabs sound generation.

🗄️ MongoDB Atlas

MongoDB Atlas is used as the application's database.

The connection string is stored in:

MONGO_URI=your_mongodb_connection_string

Multiple projects can use separate databases within the same MongoDB Atlas cluster by specifying the database name in the connection string.

Example:

mongodb+srv://username:password@cluster.mongodb.net/virtual-zoo

MongoDB credentials must never be committed to GitHub.

🔒 CORS

The backend supports local development origins and the production frontend configured through:

FRONTEND_URL=https://virtual-zoo-view.vercel.app

This keeps the production frontend URL configurable through environment variables.

🩺 Health Check

After deploying the backend to Render, test:

https://virtual-zoo-backend-8xmc.onrender.com/api/health

Expected response:

{
  "status": "ok"
}

🧪 Local Development

Run the two applications separately.

Terminal 1 — Backend

cd backend
npm install
npm start

Terminal 2 — Frontend

cd frontend
npm install
npm run dev

Local architecture:

React Frontend
      │
      ▼
Main Backend :5001
      │
      ├── MongoDB Atlas
      ├── Gemini API
      └── ElevenLabs API

🌍 Production Architecture

                    ┌─────────────────────┐
                    │   Vercel Frontend   │
                    │      React + Vite   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Render Backend    │
                    │    Node + Express   │
                    └──────────┬──────────┘
                               │
             ┌─────────────────┼─────────────────┐
             │                 │                 │
             ▼                 ▼                 ▼
       MongoDB Atlas       Gemini API       ElevenLabs

📱 Responsive Design

The application is designed to work across:

Desktop

Laptop

Tablet

Mobile devices

🛡️ Security Practices

The project uses:

Environment variables for sensitive credentials

JWT-based authentication

Password hashing

CORS configuration

Backend-only API keys

.env files excluded from Git

Production API URLs configured through environment variables

📌 Important Notes

Gemini API keys must remain on the backend.

ElevenLabs API keys must remain on the backend.

MongoDB credentials must remain in environment variables.

Frontend VITE_* variables are exposed to the browser, so private API keys must never be placed in them.

After changing Vercel environment variables, redeploy the frontend.

After changing Render environment variables, redeploy the backend.

📄 License

This project is developed for educational and development purposes.

👨‍💻 Author

Adesh Sonawane

GitHub: https://github.com/adeshsonawane46