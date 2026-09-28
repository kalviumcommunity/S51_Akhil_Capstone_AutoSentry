# Implementation Plan: Auto Sentry Completion

## Overview

Five milestones of remediation work: security hardening, UX completion, content and code quality, testing baseline, and accessibility. Each task builds on previous ones. No architectural rewrites — all changes follow the existing file structure and library choices.

## Tasks

- [x] 1. Milestone 1 — Security and Critical Bug Fixes

  - [x] 1.1 Secure backend credentials via dotenv
    - Add `dotenv` to `backend/package.json` dependencies
    - Add `require('dotenv').config()` at the top of `backend/server.js`
    - Replace the two hardcoded `mongoose.connect(...)` and `mongoose.createConnection(...)` strings with `process.env.MONGO_URI` and `process.env.MONGO_TASKS_URI`
    - Verify `backend/.env` contains both keys (do not change values, just confirm the keys exist)
    - _Requirements: 6.1, 2.1_

  - [x] 1.2 Secure frontend credentials via Vite env vars
    - In `frontend/Auto-Sentry/src/main.jsx`: replace hardcoded Supabase URL, Supabase anon key, Auth0 domain, and Auth0 clientId with `import.meta.env.VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`
    - In `frontend/Auto-Sentry/src/firebase.js`: replace all hardcoded Firebase config values with `import.meta.env.VITE_FIREBASE_STORAGE_API_KEY`, `VITE_FIREBASE_STORAGE_AUTH_DOMAIN`, `VITE_FIREBASE_STORAGE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_STORAGE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_STORAGE_APP_ID`
    - In `frontend/Auto-Sentry/src/pages/Service History/Historyconfig.js`: replace all hardcoded Firebase config values with `import.meta.env.VITE_FIREBASE_HISTORY_API_KEY`, `VITE_FIREBASE_HISTORY_AUTH_DOMAIN`, `VITE_FIREBASE_HISTORY_PROJECT_ID`, `VITE_FIREBASE_HISTORY_BUCKET`, `VITE_FIREBASE_HISTORY_MESSAGING_SENDER_ID`, `VITE_FIREBASE_HISTORY_APP_ID`
    - _Requirements: 6.2, 2.2_

  - [x] 1.3 Create frontend `.env.example` documenting all required VITE_* variables
    - Create `frontend/Auto-Sentry/.env.example` with all 16 `VITE_*` keys listed (empty values), matching the env var table in the design doc
    - _Requirements: 6.2, 2.3_

  - [x] 1.4 Fix `starst` typo in GoogleCalender.jsx
    - In `frontend/Auto-Sentry/src/pages/GoogleCalender/GoogleCalender.jsx`, remove the `console.log(starst)` line in the `googleSignIn` error handler (the variable `starst` is undefined; the fix is to remove that line)
    - _Requirements: 6.3, 2.8_

  - [x] 1.5 Fix Vehicle model schema — change `image` to String and `vin` to String
    - In `backend/models/vehicles.model.js`: replace `vin: { type: Number, required: true }` with `vin: { type: String, required: true }`
    - Replace `image: { data: Buffer, contentType: String }` with `image: { type: String, required: false }`
    - Add Mongoose `required` validation for `user`, `make`, `model`, `year`, `modification` fields (they already exist but ensure `required: true` is present so the 400 validation path works)
    - _Requirements: 6.4, 2.6, 2.7_

  - [x] 1.6 Delete dead-code files: `Garage2.jsx`, `Garage2.css`, and `dbConn.js`
    - Delete `frontend/Auto-Sentry/src/pages/Garage/Garage2.jsx`
    - Delete `frontend/Auto-Sentry/src/pages/Garage/Garage2.css`
    - Delete `backend/dbConn.js`
    - In `frontend/Auto-Sentry/src/App.jsx`: remove the `import Garage2` line and the `<Route path='/garage2' ...>` route
    - _Requirements: 6.5, 6.6, 2.9, 2.10_


- [x] 2. Milestone 2 — Core UX Completion

  - [x] 2.1 Wire LoginForm and SignupForm to Auth0
    - In `frontend/Auto-Sentry/src/pages/Login/LoginForm.jsx`: import `useAuth0`, call `loginWithRedirect()` on the "Login with Auth0" button's `onClick`; remove the static credential form fields (username/password inputs) and replace with a single branded button
    - In `frontend/Auto-Sentry/src/pages/SignUP/SignupForm.jsx`: fix the CSS import from `'./SignupForm'` to `'./SignupForm.css'`; remove the static form fields; replace with a button calling `loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })`
    - _Requirements: 7.1, 7.2, 3.1, 3.2_

  - [ ]* 2.2 Write property test for Auth0 login wiring (P2)
    - **Property 2: Auth0 loginWithRedirect on LoginForm and SignupForm click**
    - Mock `useAuth0` and assert `loginWithRedirect` is called exactly once on button click; for SignupForm assert the `screen_hint: 'signup'` param is included
    - **Validates: Requirements 7.1, 7.2**

  - [x] 2.3 Replace `location.reload()` in TaskDashboard with state updates; add error, empty, and loading states
    - In `frontend/Auto-Sentry/src/pages/Maintenance Tasks/TaskDashboard/TaskDashboard.jsx`:
    - In `handleTaskStatusChange`: replace `location.reload()` with `setTasks(prev => prev.map(t => t._id === taskId ? { ...t, taskStatus: true } : t))`
    - In `handleDeleteTask`: replace `fetch()` with `axios.delete('/api/tasks/' + taskId)`, remove the `response.ok` check pattern
    - Add `const [error, setError] = useState(null)` — set on axios `.catch()`, render `<p role="alert" className="error-msg">{error}</p>` above the task list
    - Add empty state: when `upcomingTasks.length === 0` render a message "No upcoming tasks"; when `completedTasks.length === 0` render "No completed tasks"
    - Add `const [submitting, setSubmitting] = useState(false)` — set true before `axios.post`, reset in `.finally()`; set `disabled={submitting}` on the submit button
    - Remove `<ToastContainer />` from this component (it will live in App.jsx)
    - _Requirements: 7.3, 7.9, 7.10, 3.3_

  - [ ]* 2.4 Write property tests for TaskDashboard state updates (P3, P7, P8)
    - **Property 3: Task complete moves task from upcoming to completed list without page reload**
    - **Property 7: API error renders user-visible error element**
    - **Property 8: Submit button is disabled while loading**
    - **Validates: Requirements 7.3, 7.9, 7.10**

  - [x] 2.5 Replace `location.reload()` in VehicleServiceHistory with state updates; add error, empty, and loading states
    - In `frontend/Auto-Sentry/src/pages/Service History/VehicleServiceHistory.jsx`:
    - In `handleClick`: after `addDoc` resolves, construct `newRecord` from `formData` plus the Firestore document ID; call `setData(prev => [newRecord, ...prev])` instead of `location.reload()`
    - Add `const [error, setError] = useState(null)` — set in the `addDoc` / `getDocs` catch block; render inline above the list
    - Add empty state: when `data.length === 0 && !loading` render "No service records yet"
    - Add `const [loading, setLoading] = useState(false)` — set true before the Firebase write, reset in finally; `disabled={loading}` on the Add button
    - _Requirements: 7.4, 7.10, 3.4, 3.7_

  - [ ]* 2.6 Write property tests for VehicleServiceHistory state updates (P4, P6, P8)
    - **Property 4: Service history add updates displayed list via state (no location.reload)**
    - **Property 6: Empty list renders empty-state message**
    - **Property 8: Submit button disabled while loading**
    - **Validates: Requirements 7.4, 7.8, 7.10**

  - [x] 2.7 Add error state and empty state to Garage
    - In `frontend/Auto-Sentry/src/pages/Garage/Garage.jsx`:
    - Add `const [error, setError] = useState(null)` — set in the axios `.catch()` for `fetchVehicles`; render `<p role="alert" className="error-msg">{error}</p>` when `error` is set
    - Add empty state: when `!loading && !error && vehicles.length === 0`, render a prompt "No vehicles yet — add your first car!" with a link to `/addnew`
    - _Requirements: 7.8, 7.9, 3.5, 3.8_

  - [ ]* 2.8 Write property tests for Garage empty and error states (P6, P7)
    - **Property 6: Empty list renders empty-state message**
    - **Property 7: API error renders user-visible error element**
    - **Validates: Requirements 7.8, 7.9**

  - [x] 2.9 Create 404 NotFound page and add catch-all route; add stub Profile, Settings, Help pages
    - Create `frontend/Auto-Sentry/src/pages/NotFound/NotFound.jsx`: simple 404 page with heading and a `<Link to="/">Go home</Link>`
    - Create `frontend/Auto-Sentry/src/pages/Profile/Profile.jsx`: stub page displaying `user.name` and `user.email` from `useAuth0()`
    - Create `frontend/Auto-Sentry/src/pages/Settings/Settings.jsx`: stub page with "Settings coming soon" and a back link
    - Create `frontend/Auto-Sentry/src/pages/Help/Help.jsx`: stub page with brief copy and a back link
    - In `frontend/Auto-Sentry/src/App.jsx`:
      - Add `<ToastContainer />` inside `<Router>` but outside `<Routes>` (single instance for the whole app)
      - Import and add `<Route path="/profile" element={<Profile />} />`, `/settings`, `/help`
      - Add `<Route path="*" element={<NotFound />} />`
      - Remove the existing `<ToastContainer />` import/usage if any is currently in App.jsx (it already has one — keep only this one)
    - _Requirements: 7.5, 7.6, 3.11, 3.12_

  - [x] 2.10 Implement Navbar hamburger menu toggle
    - In `frontend/Auto-Sentry/src/components/Navbar/index.jsx`:
    - Add `const [menuOpen, setMenuOpen] = useState(false)` for mobile menu state
    - Add `onClick={() => setMenuOpen(prev => !prev)}` to the `<FaBars>` element; add `aria-label="Toggle navigation menu"` and `aria-expanded={menuOpen}` to it
    - Apply a CSS class (e.g. `nav-menu--open`) to `.nav-menu` conditionally when `menuOpen` is true
    - Add corresponding CSS in `Navbar.css` to show/hide the mobile menu based on that class
    - _Requirements: 7.7, 3.13_

  - [ ]* 2.11 Write property test for hamburger toggle (P5)
    - **Property 5: Clicking hamburger toggles menu open; clicking again closes it**
    - **Validates: Requirements 7.7, 3.13**

  - [x] 2.12 Add loading state to AddNew and UpdateVehicle submit buttons
    - In `frontend/Auto-Sentry/src/components/Add New/addnew.jsx`: add `const [loading, setLoading] = useState(false)` — set true before `axios.post`, reset in `.finally()`; set `disabled={loading}` on the submit button; change VIN input `type` from `number` to `text`
    - In `frontend/Auto-Sentry/src/components/Update Vehicle/updateVehicle.jsx`: add same loading state pattern around the `axios.put` call; `disabled={loading}` on the Update button
    - Remove `<ToastContainer />` from `addnew.jsx` (toast calls remain — only the container moves to App.jsx)
    - _Requirements: 7.10, 3.14_

  - [ ]* 2.13 Write property test for submit button disabled while loading (P8)
    - **Property 8: Submit button has `disabled={true}` while async request is in flight**
    - Test all three forms: AddNew, UpdateVehicle, VehicleServiceHistory
    - **Validates: Requirements 7.10, 3.14**

  - [x] 2.14 Checkpoint — Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.


- [ ] 3. Milestone 3 — Content, Polish, and Code Quality

  - [x] 3.1 Add Vite `/api` proxy and replace all hardcoded `http://localhost:5000` URLs
    - In `frontend/Auto-Sentry/vite.config.js`: add `server: { proxy: { '/api': 'http://localhost:5000' } }` inside `defineConfig`
    - In every frontend file that uses `http://localhost:5000/api/...`, replace with `/api/...`:
      - `frontend/Auto-Sentry/src/pages/Garage/Garage.jsx` (GET vehicles, DELETE vehicle)
      - `frontend/Auto-Sentry/src/pages/Maintenance Tasks/TaskDashboard/TaskDashboard.jsx` (GET byVehicle, POST tasks, PUT task, DELETE task)
      - `frontend/Auto-Sentry/src/components/Add New/addnew.jsx` (POST vehicles)
      - `frontend/Auto-Sentry/src/components/Update Vehicle/updateVehicle.jsx` (GET vehicle by id, PUT vehicle)
    - _Requirements: 8.13, 5.2_

  - [x] 3.2 Rename `updateVehicle` component to `UpdateVehicle` (capitalized)
    - Rename file `frontend/Auto-Sentry/src/components/Update Vehicle/updateVehicle.jsx` → `UpdateVehicle.jsx` and the component name inside from `updateVehicle` to `UpdateVehicle`
    - Update the import in `frontend/Auto-Sentry/src/App.jsx` to `import UpdateVehicle from './components/Update Vehicle/UpdateVehicle'`
    - _Requirements: 8.10, 4.6_

  - [x] 3.3 Fix Navbar: remove `activeClassName`, remove `<ToastContainer>`, add Escape key handler
    - In `frontend/Auto-Sentry/src/components/Navbar/index.jsx`:
    - Remove the `<ToastContainer />` import and JSX usage
    - Replace all `activeClassName="active"` props with the RR v6 `className` callback: `className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}`
    - Add a `useEffect` that listens for `keydown` on `document`; when `key === 'Escape'`, set both `menuOpen` and `showDropdown` to false; clean up the listener on unmount
    - _Requirements: 8.6, 4.7_

  - [x] 3.4 Fix Garage.jsx: remove duplicate ToastContainer, fix SVG props, change delete `<a>` to `<button>`, remove "Empty" button
    - In `frontend/Auto-Sentry/src/pages/Garage/Garage.jsx`:
    - Remove both `<ToastContainer />` instances (App.jsx owns it now)
    - In the SVG `<g>` element: change `fill-rule` → `fillRule`, `stroke-width` → `strokeWidth`, `stroke-linecap` → `strokeLinecap`, `stroke-linejoin` → `strokeLinejoin`
    - Change `<a className="btn-danger" onClick={...}>` to `<button className="btn-danger" aria-label="Delete vehicle" onClick={...}>`
    - Remove the `<NavLink to="/servicehistory"><button className="btn-mt">Empty</button></NavLink>` from vehicle card action buttons
    - Remove `activeClassName="active"` from the NavLink elements (same RR v6 fix as Navbar)
    - _Requirements: 8.7, 8.8, 8.9, 8.12, 4.8, 4.9, 4.11_

  - [x] 3.5 Fix TaskDashboard: replace remaining `fetch()` with axios, remove ToastContainer, add delete `<div>` → `<button>`
    - In `frontend/Auto-Sentry/src/pages/Maintenance Tasks/TaskDashboard/TaskDashboard.jsx`:
    - Confirm all API calls now use `axios` (was done in task 2.3 — verify none remain)
    - The delete trigger in the completed list uses `<div className="delbtn" onClick={...}>` — change to `<button className="delbtn" aria-label="Delete task" onClick={...}>`
    - _Requirements: 8.9, 4.10_

  - [x] 3.6 Replace About page Lorem Ipsum with real Auto Sentry content
    - In the About page files (check `frontend/Auto-Sentry/src/pages/About/`): replace all placeholder text and broken `img/about.jpg` reference with genuine product description, mission statement, and a team section
    - _Requirements: 8.1, 4.1_

  - [x] 3.7 Replace Services page stub with service cards grid
    - In `frontend/Auto-Sentry/src/pages/Services/Services.jsx`: replace the `<h1>Services</h1>` stub with a grid of four service cards: Maintenance Tracking, Service History, Google Calendar Integration, Vehicle Garage — each with a short description
    - _Requirements: 8.2, 4.2_

  - [x] 3.8 Replace Contact page stub with a contact form
    - In `frontend/Auto-Sentry/src/pages/Contact/Contact.jsx`: replace the `<h1>Contact Us</h1>` stub with a form containing name, email, and message fields; on submit call `toast.success('Message sent!')` (no backend needed)
    - _Requirements: 8.3, 4.3_

  - [x] 3.9 Fix Home page feature tile links and add newsletter handler
    - In `frontend/Auto-Sentry/src/pages/Home/Home.jsx`:
    - Change the three "Explore Page" `NavLink to="/"` links to point to `/services`, `/garage`, and `/Googlecalender` respectively (Track → `/garage`, Maintain → `/services`, Schedule → `/Googlecalender`)
    - Add `const [email, setEmail] = useState('')` and bind it to the newsletter `<input>`
    - Add `handleNewsletterSubmit`: validate email with a regex; if valid call `toast.success('Subscribed!')`, else call `toast.error('Please enter a valid email')`; wire `onClick` on the Subscribe button
    - _Requirements: 8.4, 8.5, 4.4, 4.5_

  - [ ]* 3.10 Write property tests for Home tile links and newsletter validation (P9, P10)
    - **Property 9: All feature tile links have a `to` value that is not `'/'`**
    - **Property 10: Valid email → success toast triggered; invalid email → no toast**
    - **Validates: Requirements 8.4, 8.5**

  - [x] 3.11 Audit and remove confirmed-unused dependencies from frontend package.json
    - In `frontend/Auto-Sentry/package.json`: remove `styled-components`, `reactstrap`, and `uuid` (search codebase for usages first; only remove if genuinely unused)
    - Run `vite build` (or check with getDiagnostics) to confirm no import errors after removal
    - _Requirements: 8.13, 5.1_

  - [x] 3.12 Checkpoint — Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.


- [x] 4. Milestone 4 — Testing Baseline

  - [x] 4.1 Set up frontend test infrastructure (Vitest + RTL + fast-check)
    - In `frontend/Auto-Sentry/package.json` devDependencies: add `"vitest": "^1.6.0"`, `"@testing-library/react": "^14.3.1"`, `"@testing-library/jest-dom": "^6.4.2"`, `"@testing-library/user-event": "^14.5.2"`, `"fast-check": "^3.19.0"`, `"jsdom": "^24.1.0"`
    - Add test script: `"test": "vitest --run"`, `"test:watch": "vitest"`
    - In `frontend/Auto-Sentry/vite.config.js`: add `test: { environment: 'jsdom', setupFiles: ['./src/test/setup.js'], globals: true }` inside `defineConfig`
    - Create `frontend/Auto-Sentry/src/test/setup.js` with `import '@testing-library/jest-dom'`
    - _Requirements: 9.1_

  - [x] 4.2 Set up backend test infrastructure (Jest + Supertest + mongodb-memory-server)
    - In `backend/package.json` devDependencies: add `"jest": "^29.7.0"`, `"supertest": "^6.3.4"`, `"@types/jest": "^29.5.12"`, `"mongodb-memory-server": "^9.3.0"`
    - Replace the test script with `"test": "jest --runInBand"`, add `"test:watch": "jest --watch"`
    - Add `"jest": { "testEnvironment": "node" }` config in `backend/package.json`
    - _Requirements: 9.2_

  - [x] 4.3 Write frontend unit tests for new pages and structural requirements
    - Create `frontend/Auto-Sentry/src/pages/NotFound/__tests__/NotFound.test.jsx`: assert the 404 page renders when navigating to an unknown path
    - Create tests asserting `/profile`, `/settings`, `/help` routes each render their stub page component
    - Assert `App` renders only one `<ToastContainer />` instance
    - Assert the vehicle card delete action is a `<button>` element (not an `<a>`)
    - Assert the Contact page renders name, email, message inputs and a submit button
    - _Requirements: 9.3 (structural)_

  - [x] 4.4 Write frontend property-based tests for Garage (P11, P12)
    - Create `frontend/Auto-Sentry/src/pages/Garage/__tests__/Garage.test.jsx`
    - **Property 11:** For any array of N vehicle objects, mock the axios GET and assert exactly N vehicle card elements render — `// Feature: auto-sentry-completion, Property 11`
    - **Property 12:** For any valid vehicle form data object, submit AddNew and assert the axios POST body contains all original field values — `// Feature: auto-sentry-completion, Property 12`
    - **Validates: Requirements 9.3, 9.4**

  - [ ]* 4.5 Write property test for task tab routing by status (P13)
    - Create `frontend/Auto-Sentry/src/pages/Maintenance Tasks/TaskDashboard/__tests__/TaskDashboard.test.jsx`
    - **Property 13:** For any mixed task list, Upcoming tab shows only `taskStatus === false` tasks; Completed tab shows only `taskStatus === true` tasks
    - `// Feature: auto-sentry-completion, Property 13`
    - **Validates: Requirements 9.5**

  - [x] 4.6 Write backend property-based tests for vehicles API (P14) and tasks API (P15)
    - Create `backend/__tests__/vehicles.test.js` using mongodb-memory-server + supertest
    - **Property 14:** For any POST body missing one required field (user, make, model, year, modification, vin), assert status 400 — `// Feature: auto-sentry-completion, Property 14`
    - Fix `POST /api/vehicles` handler: change `res.status(500)` to check for `ValidationError` and return 400 (mirrors the tasks route pattern already present)
    - Create `backend/__tests__/tasks.test.js`
    - **Property 15:** Seed N tasks for vehicleId A and M tasks for vehicleId B; assert `GET /api/tasks/byVehicle/A` returns exactly the tasks where `vehicleId === A` — `// Feature: auto-sentry-completion, Property 15`
    - **Validates: Requirements 9.7, 9.9**

  - [x] 4.7 Write backend unit test for vehicle delete endpoint
    - In `backend/__tests__/vehicles.test.js`: insert a vehicle document into the in-memory DB, call `DELETE /api/vehicles/deleteVehicle/:id`, assert response status 200
    - `// Feature: auto-sentry-completion, Property — unit test`
    - _Requirements: 9.8_

  - [x] 4.8 Checkpoint — Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.


- [ ] 5. Milestone 5 — Accessibility and Remaining Enhancements

  - [x] 5.1 Add skip-navigation link to App
    - In `frontend/Auto-Sentry/src/App.jsx` (or `main.jsx`): add a visually-hidden skip-nav `<a href="#main-content" className="skip-nav">Skip to main content</a>` as the very first focusable element inside `<Router>`, before `<Navbar />`
    - Add `id="main-content"` to the main content wrapper (the `<Routes>` section or a wrapping `<main>`)
    - Add `.skip-nav` CSS: visually hidden by default, visible on focus
    - _Requirements: 10.1, 5.8_

  - [ ]* 5.2 Write unit test for skip-nav as first focusable element
    - Assert the skip-navigation link renders as the first focusable element in the App component
    - _Requirements: 10.1_

  - [x] 5.3 Add `aria-label` to all icon-only buttons in Garage, TaskDashboard, and Navbar
    - In `frontend/Auto-Sentry/src/pages/Garage/Garage.jsx`: confirm delete `<button>` has `aria-label="Delete vehicle"` (done in task 3.4); add `aria-label="Edit vehicle"` to the edit NavLink/button
    - In `frontend/Auto-Sentry/src/pages/Maintenance Tasks/TaskDashboard/TaskDashboard.jsx`: add `aria-label="Add to Google Calendar"` to the calendar icon button; add `aria-label="Mark task complete"` to the check-circle button; confirm delete button has `aria-label="Delete task"`
    - In `frontend/Auto-Sentry/src/components/Navbar/index.jsx`: confirm `<FaBars>` has `aria-label="Toggle navigation menu"` (done in task 2.10)
    - _Requirements: 10.2, 5.7_

  - [ ]* 5.4 Write property test for aria-label on icon-only buttons (P17)
    - **Property 17: Every icon-only interactive button has a non-empty `aria-label` attribute**
    - Check delete buttons in Garage and TaskDashboard, calendar and complete buttons in TaskDashboard, hamburger in Navbar
    - `// Feature: auto-sentry-completion, Property 17`
    - **Validates: Requirements 10.2**

  - [x] 5.5 Add visible priority text label to TaskDashboard and Escape key handler for dropdown
    - In `frontend/Auto-Sentry/src/pages/Maintenance Tasks/TaskDashboard/TaskDashboard.jsx`:
    - The priority is already displayed as `<p>{task.priority}</p>` in a div with a color class — confirm it renders visible text (not color-only); if it is hidden, make it visible
    - Add `aria-label` like `aria-label={\`Priority: ${task.priority}\`}` to the priority `<div>` for screen readers
    - Add an Escape key `keydown` handler (useEffect on mount) to close any open priority dropdowns if such exist; at minimum ensure the tab filter buttons (`Upcoming`/`Completed`) are keyboard-navigable
    - Update the calendar `NavLink` `to` prop: `to={\`/Googlecalender?task=${encodeURIComponent(task.task)}&date=${task.dueDate}\`}` so task details are passed as query params
    - _Requirements: 10.3, 10.4, 10.6, 5.3, 5.4, 5.6_

  - [ ]* 5.6 Write property tests for priority text label and calendar query params (P19, P21)
    - **Property 19: Each rendered task contains visible text identifying priority level (High/Medium/Low)**
    - **Property 21: Calendar link `to` contains `task` name and `dueDate` as URL-encoded query params**
    - `// Feature: auto-sentry-completion, Property 19` and `// Feature: auto-sentry-completion, Property 21`
    - **Validates: Requirements 10.4, 10.6**

  - [~] 5.7 Add Escape key handler to Navbar mobile menu and dropdown
    - In `frontend/Auto-Sentry/src/components/Navbar/index.jsx`: the `useEffect` Escape handler added in task 3.3 already closes both `menuOpen` and `showDropdown` — verify both state vars are reset and the effect is properly cleaned up
    - _Requirements: 10.3, 5.3_

  - [ ]* 5.8 Write property test for Escape key closing dropdown (P18)
    - **Property 18: Pressing Escape key closes the open Navbar dropdown/menu**
    - `// Feature: auto-sentry-completion, Property 18`
    - **Validates: Requirements 10.3**

  - [~] 5.9 Add service history delete with confirmation and vehicleId field
    - In `frontend/Auto-Sentry/src/pages/Service History/VehicleServiceHistory.jsx`:
    - Add `handleDelete(id)`: call `window.confirm('Delete this record?')`; if confirmed, call Firestore `deleteDoc(doc(txtDB, 'txtData', id))`, then `setData(prev => prev.filter(r => r.id !== id))`
    - Add import for `deleteDoc`, `doc` from `firebase/firestore`
    - Add a delete button per record in the history list: `<button aria-label="Delete service record" onClick={() => handleDelete(value.id)}>Delete</button>`
    - Add a hidden `vehicleId` field to the `addDoc` call and to the `formData` state (pass empty string as default for now — full vehicle-scoping is optional future work)
    - _Requirements: 10.5, 5.4, 5.5_

  - [ ]* 5.10 Write property tests for service history delete (P20)
    - **Property 20: Clicking delete and confirming removes the record from the rendered list**
    - Mock `window.confirm` to return true; assert the deleted record is absent from the DOM after handler fires
    - `// Feature: auto-sentry-completion, Property 20`
    - **Validates: Requirements 10.5**

  - [~] 5.11 Read Google Calendar query params in GoogleCalender.jsx
    - In `frontend/Auto-Sentry/src/pages/GoogleCalender/GoogleCalender.jsx`:
    - Import `useSearchParams` from `react-router-dom`
    - Read `task` and `date` params: `const [searchParams] = useSearchParams(); const taskParam = searchParams.get('task'); const dateParam = searchParams.get('date');`
    - Use them as initial state: `useState(taskParam || '')` for `eventName` and parse `dateParam` into a `Date` for `start` if present
    - Replace the `alert()` in `googleSignIn` with `toast.error('Error logging in to Google provider')` (the `starst` line was removed in task 1.4)
    - _Requirements: 10.6, 5.6_

  - [~] 5.12 Remove confirmed-unused dependencies (final pass) and verify build
    - Review `frontend/Auto-Sentry/package.json` for any remaining unused packages not removed in task 3.11
    - Run `vite build` to confirm production build passes with no errors
    - _Requirements: 10.7, 5.1_

  - [~] 5.13 Final checkpoint — Ensure all tests pass
    - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Milestones are ordered by priority — complete Milestone 1 before starting Milestone 2
- Property tests use `fast-check` (frontend) and `fast-check` or manual iteration (backend)
- All property test files must include the tag comment `// Feature: auto-sentry-completion, Property N`
- The `<ToastContainer />` lives only in `App.jsx` after Milestone 2 — all other component-level instances are removed
- Backend test suites use `mongodb-memory-server` so no test data touches the Atlas cluster
- P1 (vehicle schema round-trip) and P16 (service history add round-trip) are backend integration tests — they require the in-memory MongoDB setup from task 4.2 before they can be written
