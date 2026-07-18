# Auto Sentry 🚗

Auto Sentry is a full-stack vehicle maintenance tracker web application that helps vehicle owners manage their fleet, track service history, schedule maintenance tasks, and book service appointments — all in one place.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
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
- **Maintenance Task Dashboard** — Per-vehicle task management with priority levels (High / Medium / Low), due dates, descriptions, and completion status tracking.
- **Service History Tracking** — Log service records with uploaded images, stored in Firebase Firestore and Firebase Storage.
- **Google Calendar Integration** — Sync maintenance schedules with Google Calendar via Supabase OAuth.
- **Book a Service** — Redirect users to external service providers based on the vehicle's make.
- **Toast Notifications** — Instant user feedback for create, update, and delete operations via React Toastify.
- **Autosuggest Forms** — Smart make/model dropdowns when adding new vehicles.
- **Responsive Design** — Built with Bootstrap and Tailwind CSS for a consistent experience across devices.

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
| React Bootstrap + Bootstrap 5 | UI components and layout |
| Tailwind CSS | Utility-first styling |
| Styled Components | Component-scoped styles |
| React Icons | Icon library |
| React Autosuggest | Make/model autocomplete |
| React Datetime Picker | Date and time input |
| React Toastify | Toast notifications |
| UUID | Unique ID generation |

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
│   ├── dbConn.js                   # Database connection utility
│   ├── .env                        # Backend environment variables
│   └── package.json
│
└── frontend/
    └── Auto-Sentry/
        ├── src/
        │   ├── App.jsx                     # Root component with routing
        │   ├── main.jsx                    # Entry point, Auth0 + Supabase providers
        │   ├── firebase.js                 # Firebase config for vehicle images
        │   ├── components/
        │   │   ├── Navbar/                 # Top navigation bar
        │   │   ├── Add New/                # Add vehicle form + makesAndModels.js
        │   │   └── Update Vehicle/         # Edit vehicle form
        │   └── pages/
        │       ├── Home/                   # Landing page
        │       ├── About/                  # About page
        │       ├── Services/               # Services overview page
        │       ├── Contact/                # Contact page
        │       ├── Login/                  # Sign in page
        │       ├── SignUP/                 # Sign up page
        │       ├── Garage/                 # Vehicle garage dashboard
        │       ├── Maintenance Tasks/      # Per-vehicle task dashboard
        │       ├── Service History/        # Service history log
        │       └── GoogleCalender/         # Google Calendar integration
        ├── index.html
        ├── vite.config.js
        ├── tailwind.config.js
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
  "vin": 1HGBH41JXMN109186,
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
- After authentication, the `user.nickname` field from Auth0 is used as the identifier to filter vehicles — each user only sees their own garage.
- The Auth0 provider wraps the entire app in `main.jsx`, making the `useAuth0()` hook available to every component.
- Authenticated routes (Garage, Add Vehicle, Maintenance Tasks, etc.) check `isAuthenticated` before rendering content.

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
- **Used for:** Storing and retrieving vehicle images when adding or updating a vehicle in the garage.
- Exports: `storage`

### 2. Service History (`Historyconfig.js`)
- **Project:** `autosentry-file-history`
- **Used for:**
  - Uploading service record images to Firebase Storage (`Imgs/` folder)
  - Saving service record text data to Firestore (`txtData` collection)
- Exports: `imgDB` (Storage), `txtDB` (Firestore)

---

## Frontend Pages & Components

### Pages

| Route | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page with app overview and call-to-action |
| `/about` | `About` | Information about Auto Sentry |
| `/services` | `Services` | Overview of services offered |
| `/contact-us` | `Contact` | Contact form or details |
| `/sign-up` | `SignupForm` | New user registration |
| `/signin` | `LoginForm` | User sign-in |
| `/garage` | `Garage` | Personal vehicle garage dashboard |
| `/addnew` | `Addnew` | Form to add a new vehicle |
| `/update/:id` | `UpdateVehicle` | Form to edit an existing vehicle |
| `/maintenancetask/:vehicleId` | `TaskDashboard` | Per-vehicle maintenance task management |
| `/servicehistory` | `VehicleServiceHistory` | Log and browse service history records |
| `/Googlecalender` | `GoogleCalender` | Google Calendar integration for scheduling |

### Components

- **Navbar** — Responsive navigation bar with Auth0 login/logout, user avatar display, and links to all major pages.
- **Add New** — Multi-field form with autosuggest for vehicle make and model, image upload, VIN entry, and modification notes.
- **Update Vehicle** — Pre-populated form to edit an existing vehicle's details.
- **Task Dashboard** — Tabbed view of pending and completed maintenance tasks per vehicle. Supports adding new tasks with priority, due date, and description. Tasks can be marked complete and moved to the completed tab.

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
git clone https://github.com/your-username/auto-sentry.git
cd auto-sentry
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Update the MongoDB connection strings in `server.js` (or move them to `.env`) with your own Atlas credentials.

Start the backend server:

```bash
node server.js
```

The API will be available at `http://localhost:5000`.

### 3. Set Up the Frontend

```bash
cd frontend/Auto-Sentry
npm install
```

Update the following config files with your own credentials:
- `src/firebase.js` — vehicle image Firebase project
- `src/pages/Service History/Historyconfig.js` — service history Firebase project
- `src/main.jsx` — Auth0 domain/clientId and Supabase URL/key

Start the frontend dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## Environment Variables

The backend `.env` file should contain:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/test
MONGO_TASKS_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/tasks
```

> Note: The frontend credentials (Auth0, Firebase, Supabase) are currently configured directly in source files. For production, move them to a `.env` file and reference them via `import.meta.env.VITE_*` variables.

---

## Available Scripts

### Backend

| Command | Description |
|---|---|
| `node server.js` | Start the server |
| `nodemon server.js` | Start with auto-restart on file changes |

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across all source files |
