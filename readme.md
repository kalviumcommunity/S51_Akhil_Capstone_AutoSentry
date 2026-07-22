# Auto Sentry 🚗

Auto Sentry is a full-stack vehicle maintenance tracker web application that helps vehicle owners manage their fleet, track service history, schedule maintenance tasks, and book service appointments — all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [UI Design System](#ui-design-system)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Authentication](#authentication)
- [Firebase Integration](#firebase-integration)
- [Frontend Pages & Components](#frontend-pages--components)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)

---

## Overview

Auto Sentry provides vehicle owners with a centralized platform to:

- Register and manage multiple vehicles in a personal digital garage
- Create and track maintenance tasks with priority levels and due dates
- Log and browse service history with image attachments
- Book service appointments through external service providers
- Integrate maintenance schedules with Google Calendar
- Receive real-time in-app notifications for task updates

---

## Features

- **User Authentication** — Secure login and registration powered by Auth0, with support for social login providers.
- **Digital Garage** — Add, update, and delete vehicles with details like make, model, year, VIN, modification notes, and a vehicle image.
- **Maintenance Task Dashboard** — Per-vehicle task management with priority levels (High / Medium / Low), due dates, descriptions, completion tracking, and overdue detection.
- **Service History Tracking** — Log service records with uploaded images stored in Firebase, collapsible record rows, and summary stats.
- **Google Calendar Integration** — Sync maintenance schedules with Google Calendar via Supabase OAuth.
- **Book a Service** — Redirect users to external service providers based on the vehicle's make.
- **Toast Notifications** — Instant user feedback for create, update, and delete operations via React Toastify.
- **Autosuggest Forms** — Smart make/model dropdowns when adding new vehicles.
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile breakpoints.
- **Confirm Modals** — Destructive actions (delete vehicle, delete task, delete service record) require explicit confirmation via a modal before proceeding.

---

## UI Design System

All pages share a consistent design language established in the `feat/ui-redesign` branch:

### Colour Palette

| Token | Hex | Usage |
|---|---|---|
| Navy | `#0a2640` | Page header bands, primary buttons, card headers |
| Navy 2 | `#1c3d5b` | Hover states, card backgrounds on dark sections |
| Green | `#5de0a5` | CTAs, eyebrow labels, focus rings, success states |
| Cyan | `#15cdfc` | Hover accents, button hover glows |
| Gray 50 | `#f8f9fa` | Page backgrounds |
| Gray 100 | `#f0f2f5` | Card surfaces |

### Typography

- **Font:** [Inter](https://fonts.google.com/specimen/Inter) (400 / 500 / 600 / 700 / 800 / 900)
- Loaded via Google Fonts in both `App.css` and individual component CSS files as a fallback.

### Page Layout Pattern

Every authenticated inner page (Garage, Maintenance Tasks, Service History, Add Vehicle, Update Vehicle) follows the same layout:

```
┌──────────────────────────────────────────────┐
│  Dark navy header band                       │  ← #0a2640, padding 48px 0 40px
│  Eyebrow label (green, uppercase)            │
│  Large page title (white, 900 weight)        │
│  Subtitle / record count (muted white)       │
│  Back / action button aligned right          │
└──────────────────────────────────────────────┘
┌──────────────────────────────────────────────┐
│  Page body (max-width 1160px, #f8f9fa bg)   │  ← Cards, grids, forms below
└──────────────────────────────────────────────┘
```

### Shared Component Patterns

- **Buttons:** Pill-shaped (border-radius 50px) for primary/ghost CTAs; rounded-10px for card-level actions.
- **Form inputs:** `border: 1.5px solid #e5e7eb`, `border-radius: 10px`, green focus ring (`box-shadow: 0 0 0 3px rgba(93,224,165,0.15)`).
- **Cards:** `border-radius: 20px`, `border: 1px solid #e5e7eb`, white background, `box-shadow` on hover with `translateY(-3px)`.
- **Delete confirmation:** All destructive actions use a modal with a blurred overlay instead of `window.confirm()`.
- **CSS naming:** Each page/component uses a unique 2–3 letter prefix (`.av-`, `.uv-`, `.sh-`, `.td-`, `.garage-`) to prevent style collisions.

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite 5 | Build tool and dev server |
| React Router DOM 6 | Client-side routing |
| Auth0 (`@auth0/auth0-react`) | User authentication |
| Supabase (`@supabase/auth-helpers-react`) | Google OAuth for Calendar |
| Firebase 10 | Vehicle image storage + service history |
| Axios | HTTP client for API calls |
| React Hook Form | Form state management and validation |
| React Icons | Icon library (fa, md, bs, hi, ri, ti) |
| React Autosuggest | Make/model autocomplete |
| React Toastify | Toast notifications |
| Inter (Google Fonts) | Primary UI typeface |
| UUID | Unique ID generation for Firebase uploads |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 4 | REST API server |
| Mongoose 8 | MongoDB ODM |
| MongoDB Atlas | Cloud database (two separate DBs) |
| CORS | Cross-origin request handling |
| Body Parser | Request JSON parsing |
| Nodemon | Auto-restart during development |

---

## Project Structure

```
Auto-Sentry/
├── backend/
│   ├── models/
│   │   ├── vehicles.model.js       # Vehicle mongoose schema
│   │   └── tasks.model.js          # Maintenance task mongoose schema
│   ├── server.js                   # Express server and all API routes
│   ├── app.js                      # Express app (separated for testing)
│   ├── .env                        # Backend environment variables
│   └── package.json
│
└── frontend/
    └── Auto-Sentry/
        ├── src/
        │   ├── App.jsx                     # Root component with routing
        │   ├── App.css                     # Global styles, Inter font, navbar offset
        │   ├── main.jsx                    # Entry point, Auth0 + Supabase providers
        │   ├── firebase.js                 # Firebase config for vehicle images
        │   ├── components/
        │   │   ├── Navbar/
        │   │   │   ├── index.jsx           # Transparent/frosted navbar, click-toggle account dropdown
        │   │   │   └── Navbar.css
        │   │   ├── Add New/
        │   │   │   ├── addnew.jsx          # Add vehicle form with autosuggest + image preview
        │   │   │   ├── addnew.css
        │   │   │   └── makesAndModels.js   # Make → models mapping data
        │   │   └── Update Vehicle/
        │   │       ├── UpdateVehicle.jsx   # Edit vehicle form with loading state + image banner
        │   │       └── updateVehicle.css
        │   └── pages/
        │       ├── Home/                   # Landing page (hero, services, stats, testimonials, blog, newsletter, footer)
        │       ├── About/                  # Mission, stats, why-us cards, team, tech stack, CTA
        │       ├── Services/               # Service cards grid, how-it-works steps, feature highlights, CTA
        │       ├── Contact/                # Contact form, info card, social links, FAQ section
        │       ├── Login/
        │       ├── SignUP/
        │       ├── Garage/                 # Vehicle card grid, confirm-modal delete
        │       ├── Maintenance Tasks/
        │       │   └── TaskDashboard/      # Stats, create form, tabbed task list, priority badges
        │       ├── Service History/        # Collapsible add form, expandable records, receipt preview
        │       ├── GoogleCalender/
        │       ├── Profile/
        │       ├── Settings/
        │       ├── Help/
        │       └── NotFound/
        ├── index.html
        ├── vite.config.js
        └── package.json
```

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     Browser                          │
│                                                     │
│   React + Vite Frontend (localhost:5173)            │
│   ┌──────────┐  ┌──────────┐  ┌─────────────────┐  │
│   │  Auth0   │  │ Supabase │  │    Firebase      │  │
│   │  (Login) │  │(Calendar)│  │ (Images/History) │  │
│   └──────────┘  └──────────┘  └─────────────────┘  │
│          │                                          │
│          │ Axios HTTP Requests                      │
└──────────┼──────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────┐
│   Express Backend           │
│   (localhost:5000)          │
│                             │
│   /api/vehicles  ──────┐    │
│   /api/tasks     ──────┼──► MongoDB Atlas
└─────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
               DB: "test"          DB: "tasks"
               (Vehicles)    (Maintenance Tasks)
```

---

## Database Schema

### Vehicle

```js
{
  user: String,           // Auth0 nickname (links vehicle to user)
  make: String,           // e.g. "Toyota"
  model: String,          // e.g. "Camry"
  year: Number,           // e.g. 2021
  modification: String,   // e.g. "Sport edition, tinted windows"
  vin: Number,            // Vehicle Identification Number
  image: String,          // Image URL (stored in Firebase)
  createdAt: Date,        // Auto-generated
  updatedAt: Date         // Auto-generated
}
```

### Maintenance Task

```js
{
  user: String,           // Auth0 nickname (optional)
  vehicleId: String,      // MongoDB ObjectId of the vehicle
  task: String,           // e.g. "Oil Change"
  priority: String,       // "High" | "Medium" | "Low"
  dueDate: Date,          // Scheduled date for the task
  taskDescription: String,// Detailed description
  taskStatus: Boolean,    // false = pending, true = completed
  createdAt: Date,
  updatedAt: Date
}
```

---

## API Reference

All endpoints are served from `http://localhost:5000`.

### Vehicles

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/vehicles` | Get all vehicles |
| `GET` | `/api/vehicles/:id` | Get a single vehicle by ID |
| `POST` | `/api/vehicles` | Create a new vehicle |
| `PUT` | `/api/vehicles/updateVehicle/:id` | Update a vehicle by ID |
| `DELETE` | `/api/vehicles/deleteVehicle/:id` | Delete a vehicle by ID |

### Maintenance Tasks

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Get all tasks |
| `GET` | `/api/tasks/byVehicle/:vehicleId` | Get all tasks for a specific vehicle |
| `POST` | `/api/tasks` | Create a new maintenance task |
| `PUT` | `/api/tasks/:id` | Update a task by ID |
| `DELETE` | `/api/tasks/:id` | Delete a task by ID |

#### Example — Create a Vehicle

```json
POST /api/vehicles
{
  "user": "john_doe",
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "modification": "None",
  "vin": "1HGBH41JXMN109186",
  "image": "https://firebase-storage-url/vehicle.jpg"
}
```

#### Example — Create a Maintenance Task

```json
POST /api/tasks
{
  "vehicleId": "664f1a2b3c4d5e6f7a8b9c0d",
  "task": "Tire Rotation",
  "priority": "Medium",
  "dueDate": "2024-08-15T00:00:00.000Z",
  "taskDescription": "Rotate all four tires for even wear."
}
```

---

## Authentication

Auto Sentry uses **Auth0** as the primary authentication provider.

- Users sign up and log in via the Auth0 Universal Login page.
- After authentication, `user.nickname` is used as the identifier to filter vehicles — each user only sees their own garage.
- The Auth0 provider wraps the entire app in `main.jsx`, making the `useAuth0()` hook available everywhere.
- Authenticated routes (Garage, Add Vehicle, Maintenance Tasks, etc.) check `isAuthenticated` before rendering.

**Auth0 Configuration:**
```
Domain:    dev-prcadxa6cb3hoydl.us.auth0.com
Client ID: KBPcKOIylTB5bzloJPwUHktUOQRqC9iH
Redirect:  window.location.origin
```

For **Google Calendar integration**, Supabase handles the Google OAuth flow separately, providing a session token used to interact with the Google Calendar API.

---

## Firebase Integration

Auto Sentry uses two separate Firebase projects:

### 1. Vehicle Image Storage (`firebase.js`)
- **Project:** `akhil-storage`
- **Used for:** Storing and retrieving vehicle images when adding or updating a vehicle.
- Exports: `storage`

### 2. Service History (`Historyconfig.js`)
- **Project:** `autosentry-file-history`
- **Used for:**
  - Uploading service record images to Firebase Storage (`Imgs/` folder)
  - Saving service record text data to Firestore (`txtData` collection)
  - Querying records filtered by `user` field
- Exports: `imgDB` (Storage), `txtDB` (Firestore)

---

## Frontend Pages & Components

### Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page — hero, services, stats, testimonials, blog, newsletter, footer |
| `/about` | `About` | Mission statement, stats, why-choose-us feature cards, team profile, tech stack, CTA |
| `/services` | `Services` | 8-card feature grid, how-it-works steps, alternating image highlights, CTA |
| `/contact-us` | `Contact` | Two-column layout — contact info card + message form, FAQ section |
| `/sign-up` | `SignupForm` | New user registration |
| `/signin` | `LoginForm` | User sign-in |
| `/garage` | `Garage` | Personal vehicle garage — card grid with edit/delete/actions |
| `/addnew` | `Addnew` | Add a new vehicle with autosuggest and image URL preview |
| `/update/:id` | `UpdateVehicle` | Edit an existing vehicle — pre-populated with image banner |
| `/maintenancetask/:vehicleId` | `TaskDashboard` | Per-vehicle task management with stats, priorities, overdue detection |
| `/servicehistory` | `VehicleServiceHistory` | Log and browse service history with Firebase storage |
| `/Googlecalender` | `GoogleCalender` | Google Calendar integration for scheduling |
| `/profile` | `Profile` | User profile page |
| `/settings` | `Settings` | Account settings |
| `/help` | `Help` | Help and support |

### Components

- **Navbar** — Fixed transparent overlay on the homepage hero; transitions to a frosted-glass dark navy bar on scroll. Account menu is a click-toggle dropdown (not hover) containing user info, nav links with icon tiles, and a sign-out button. Hamburger menu for mobile.
- **Add New** — Multi-field form with autosuggest for vehicle make (falls back to free-text for unknown makes), dynamic model `<select>` populated from `makesAndModels.js`, live image URL preview, and a Cancel/Submit footer.
- **Update Vehicle** — Same form layout as Add New, pre-populated by fetching the vehicle by ID. Shows a loading spinner while fetching, and displays the current vehicle image as a banner at the top of the form once loaded.

---

## Getting Started

### Prerequisites

- Node.js v18+
- npm v9+
- A MongoDB Atlas account
- An Auth0 account
- A Firebase project (two separate projects recommended)
- A Supabase project (for Google Calendar OAuth)

### 1. Clone the Repository

```bash
git clone https://github.com/kalviumcommunity/S51_Akhil_Capstone_AutoSentry.git
cd S51_Akhil_Capstone_AutoSentry
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and fill in your MongoDB credentials:

```bash
cp .env.example .env
```

Start the backend server:

```bash
node server.js
# or with auto-restart:
npx nodemon server.js
```

The API will be available at `http://localhost:5000`.

### 3. Set Up the Frontend

```bash
cd frontend/Auto-Sentry
npm install
```

Copy `.env.example` to `.env` and fill in your Firebase, Auth0, and Supabase credentials:

```bash
cp .env.example .env
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/test?retryWrites=true&w=majority
MONGO_TASKS_URI=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/tasks?retryWrites=true&w=majority
```

### Frontend — `frontend/Auto-Sentry/.env`

```env
# Auth0
VITE_AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
VITE_AUTH0_CLIENT_ID=your-auth0-client-id

# Supabase (Google Calendar OAuth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Firebase — Vehicle Images
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Firebase — Service History
VITE_FIREBASE_HISTORY_API_KEY=...
VITE_FIREBASE_HISTORY_AUTH_DOMAIN=...
VITE_FIREBASE_HISTORY_PROJECT_ID=...
VITE_FIREBASE_HISTORY_BUCKET=...
VITE_FIREBASE_HISTORY_MESSAGING_SENDER_ID=...
VITE_FIREBASE_HISTORY_APP_ID=...
```

> `.env` files are gitignored and must never be committed.

---

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `node server.js` | Start the server |
| `npx nodemon server.js` | Start with auto-restart on file changes |
| `npm test` | Run backend test suite (Jest) |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |
| `npm test` | Run frontend test suite (Vitest) |
