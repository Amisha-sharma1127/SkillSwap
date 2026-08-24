# SkillSwap

A peer-to-peer skill exchange platform where students trade skills using an internal credit system instead of money — teach a session, earn credits; spend credits to learn something new.

Built for **25CS022 — Back-end Engineering**, Chitkara University.

## Problem Statement

Students often want to learn new skills but paid courses and mentors are expensive, while other students already possess valuable skills and would be happy to teach in exchange for learning something themselves. Existing platforms either involve real money or rely on informal, untracked arrangements with no accountability. SkillSwap solves this with an internal credit ledger — no money involved, just fair, tracked bartering.

## Tech Stack

**Frontend:** React (Vite), React Router, Axios, Context API
**Backend:** Node.js, Express.js
**Database:** MongoDB (Atlas) with Mongoose
**Auth:** JWT, bcrypt

## Features

- Secure JWT-based authentication (register/login)
- Skill listing CRUD (offer/want) with search & filter
- Session lifecycle: request → confirm → complete / cancel
- Concurrency-safe credit ledger (hold / release / refund) using atomic MongoDB updates
- Review system after completed sessions

## Project Structure

```
skillswap/
├── server/               # Express + MongoDB backend
│   ├── models/            # User, SkillListing, Session, Transaction, Review
│   ├── controllers/        # Business logic
│   ├── routes/             # API route definitions
│   ├── middleware/         # JWT auth guard
│   └── server.js
├── client/                # React (Vite) frontend
│   └── src/
│       ├── pages/           # Login, Register, Browse, MyListings, CreateListing, Sessions
│       ├── components/      # Navbar
│       ├── context/         # AuthContext (global auth state)
│       └── api/             # Axios instance
└── README.md
```

## Setup Instructions

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env` and add your MongoDB Atlas connection string and a JWT secret:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=any_long_random_string
```

Run the server:
```bash
npm run dev
```
Should show `MongoDB connected` and `Server running on port 5000`.

### 2. Frontend

In a **separate terminal**:
```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173`.

**Note:** both the backend (`server`) and frontend (`client`) must be running simultaneously for the app to work.

## API Overview

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Create account | No |
| POST | `/api/auth/login` | Log in, get JWT | No |
| GET | `/api/auth/profile` | Get current user | Yes |
| GET | `/api/listings` | Browse/search listings | No |
| POST | `/api/listings` | Create listing | Yes |
| GET | `/api/listings/mine` | Get my listings | Yes |
| PATCH | `/api/listings/:id` | Update own listing | Yes |
| DELETE | `/api/listings/:id` | Delete own listing | Yes |
| POST | `/api/sessions/request` | Request a session | Yes |
| PATCH | `/api/sessions/:id/confirm` | Confirm — holds credits | Yes |
| PATCH | `/api/sessions/:id/complete` | Complete — releases credits | Yes |
| PATCH | `/api/sessions/:id/cancel` | Cancel — refunds if held | Yes |
| GET | `/api/sessions/mine` | Get my sessions | Yes |

## Core Design Decision: The Credit Ledger

Credits move through a state machine tied to session status:

```
REQUESTED --confirm--> CONFIRMED --complete--> COMPLETED
    |                       |
  cancel                  cancel/no_show
    v                       v
CANCELLED               CANCELLED (refund issued)
```

Concurrency safety is achieved using MongoDB's atomic `findOneAndUpdate` with a balance-guard condition, rather than a read-then-write pattern — this prevents two simultaneous confirmations from both passing a balance check before either writes, which would otherwise allow a user's balance to go negative.

## Team

| Member | Module |
|---|---|
| Amisha Sharma | Auth, Listings, Session/Ledger logic |
| Aryan Choudhary | Frontend integration, Reviews |

## Future Scope

- Real-time notifications on session status changes
- File upload for profile photos and skill certificates
- In-app messaging between matched users
- Rating-weighted search ranking
