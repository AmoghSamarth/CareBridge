# CareBridge

> "When life gets busy, care comes to you."

CareBridge is an AI-powered grooming companion (`Wingman`) and beauty salon marketplace tailored for Nagpur, Maharashtra.

## Project Structure

- `client/`: React + Vite + Tailwind CSS frontend
- `server/`: Node.js + Express backend powered by Firebase Firestore

---

## Getting Started

### Prerequisites
- Node.js v18+
- npm

### 1. Install dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure environment variables

Copy `.env.example` to the respective folders and fill in your keys:

```bash
# Server env
cp .env.example server/.env

# Client env — copy just the VITE_ variables into client/.env
```

Or refer to the pre-filled `.env` files already set up in `server/.env` and `client/.env`.

### 3. Run the app (two terminals required)

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```
> Server runs at: http://localhost:3000

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```
> App runs at: http://localhost:5173

### 4. (Optional) Seed Firestore with professionals

First enable the [Cloud Firestore API](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=carebridge-3eec0) in your Google Cloud project, then run:

```bash
cd server
node seed/seedProfessionals.js
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/professionals` | List professionals (supports `?area=`, `?service=`, `?available=true`) |
| GET | `/api/professionals/:id` | Get a single professional |
| POST | `/api/wingman/message` | Stream a Wingman AI message (SSE) |
| POST | `/api/search` | NLP-powered smart search via Gemini |
| GET | `/api/bookings?userId=` | Get user bookings |
| POST | `/api/bookings` | Create a booking |
| PATCH | `/api/bookings/:id` | Update a booking |

---

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion, GSAP, Lucide Icons
- **Backend**: Node.js, Express, Firebase Admin SDK, Gemini AI (`gemini-1.5-flash`)
- **Database**: Firebase Firestore (with local `salons.json` fallback)
- **Auth**: Firebase Auth (Google Sign-In)
- **Images**: Unsplash API
