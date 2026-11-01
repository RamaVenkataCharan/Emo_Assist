# EMO Assistant

EMO Assistant is a thoughtful, emotionally aware wellness companion built with Next.js and TypeScript. It helps users reflect on their emotional state, journal their experiences, track mood patterns, and access guided, empathetic support in a calm and non-clinical environment.

The app combines:
- AI-powered emotional conversations
- Mood and journal tracking
- Wellness analytics dashboard
- Crisis-aware safety checks
- Interactive 3D mood visualization
- Guided breathing and grounding experiences

---

## Why this project exists

Mental health support tools should feel personal, safe, and calming—not clinical or overwhelming. EMO Assistant is designed as a self-care and reflection companion that encourages users to:
- notice emotional patterns
- process thoughts without judgment
- track personal mood shifts over time
- receive grounded, compassionate responses
- pause and reset through mindful breathing exercises

---

## Features

### 1. Empathetic AI Companion
- Conversational emotional support
- Sentiment-aware responses
- Context from recent mood and journal entries
- Crisis screening and safety-first handling

### 2. Mood Tracking
- Log mood states with intensity levels
- Add notes and tags
- View recent emotional history

### 3. Journal Experience
- Write reflections and personal notes
- Receive AI-generated supportive feedback
- Track emotional themes over time

### 4. Emotional Analytics Dashboard
- Trend tracking for mood intensity
- Dominant emotional pattern summaries
- Journal sentiment breakdown
- Wellness insights over recent periods

### 5. 3D Emotional Interface
- Interactive mood orb and 3D visual feedback
- Immersive, calming application design
- Responsive and modern UI built with Tailwind CSS

### 6. Safety Boundaries
- Non-diagnostic, supportive guidance only
- High-risk message detection
- Crisis resource suggestions with emergency-support references

---

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite
- Anthropic API
- Framer Motion
- Recharts
- Three.js / WebGL visual components

---

## Project Structure

```bash
.
├── app/                     # App routes and UI pages
│   ├── api/                 # API endpoints
│   │   ├── analytics/
│   │   ├── chat/
│   │   ├── crisis-check/
│   │   ├── journal/
│   │   └── mood/
│   ├── (main)/              # Main application pages
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/             # Reusable frontend components
│   ├── chat/
│   ├── crisis/
│   ├── dashboard/
│   ├── journal/
│   ├── mood/
│   ├── three/
│   └── ui/
├── lib/                    # Application logic and AI helpers
│   ├── anthropic.ts
│   ├── crisisDetection.ts
│   ├── prisma.ts
│   ├── prompts/
│   ├── sentiment.ts
│   └── user.ts
├── prisma/
│   └── schema.prisma
├── types/
├── .gitignore
├── LICENSE
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js 18+
- npm
- SQLite

### Install dependencies

```bash
npm install
```

### Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./dev.db"
ANTHROPIC_API_KEY="your_anthropic_api_key_here"
```

### Generate Prisma client

```bash
npx prisma generate
```

### Run the app locally

```bash
npm run dev
```

Then open:

```bash
http://localhost:3000
```

---

## Available Scripts

```bash
npm run dev       # Start the development server
npm run build     # Build the application
npm run start     # Run the production build
npm run lint      # Run lint checks
```

---

## Database

This project uses Prisma with SQLite.

The main data models include:
- User
- MoodEntry
- JournalEntry
- ChatMessage

The schema is defined in:

```bash
prisma/schema.prisma
```

If you need to initialize or update the database:

```bash
npx prisma db push
```

---

## API Overview

### Chat API
- Handles user messages
- Performs crisis screening
- Detects sentiment/emotion
- Uses AI to return supportive responses

### Mood API
- Creates and fetches mood entries
- Supports tracking emotional intensity and notes

### Journal API
- Saves journal entries
- Stores reflection and sentiment metadata

### Analytics API
- Aggregates mood and journal trends
- Provides emotional insight summaries for the dashboard

---

## Safety Notice

EMO Assistant is intended as a self-care and reflection tool and is not a substitute for professional medical or mental health treatment. The app includes crisis screening and emergency support suggestions for high-risk conversations, but it should not be used as a substitute for urgent clinical support in emergency situations.

If someone is in immediate danger or experiencing a crisis:
- Contact local emergency services
- Reach out to a trusted person
- Use crisis hotlines available in your region

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contributing

Contributions are welcome. If you want to improve the product:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## Acknowledgements

This project uses:
- Next.js
- Prisma
- Tailwind CSS
- Anthropic AI
- Open-source UI and animation libraries

---

## Project Summary

EMO Assistant is a calming emotional wellness application built to help people become more aware of their mood, write openly, and connect with supportive AI responses that feel humane and grounded. It combines compassionate UX, modern web technologies, and safety-aware design principles to create a reflective emotional companion experience.
