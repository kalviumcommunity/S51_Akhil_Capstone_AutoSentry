# Requirements Document

## Introduction

Auto Sentry is a full-stack vehicle maintenance tracker web application. The backend REST API (Express + MongoDB), core data models, Firebase integrations, and primary React page structure are already in place. This document captures all requirements needed to bring Auto Sentry to production-ready status, based on a thorough discovery of the existing codebase.

The remaining work spans: fixing broken/stub pages, completing missing UI features, hardening authentication flows, securing configuration, wiring up missing API integrations, adding input validation and error handling throughout, improving responsiveness/accessibility, removing dead code, and establishing a test baseline.

---

## Glossary

- **App**: The Auto Sentry React single-page application.
- **API**: The Express backend REST API running on port 5000.
- **Auth0_Provider**: The Auth0 authentication service wrapping the entire App.
- **Garage**: The per-user vehicle management dashboard page (`/garage`).
- **Vehicle_Card**: A UI card representing a single vehicle in the Garage.
- **Task_Dashboard**: The per-vehicle maintenance task management page (`/maintenancetask/:vehicleId`).
- **Service_History**: The Firebase Firestore-backed service record log page (`/servicehistory`).
- **Google_Calendar**: The Supabase-OAuth-backed Google Calendar event creation page (`/Googlecalender`).
- **Navbar**: The top navigation component rendered on all pages.
- **AddNew_Form**: The form component for adding a new vehicle.
- **UpdateVehicle_Form**: The form component for editing an existing vehicle.
- **Firebase_Storage**: The Firebase storage bucket used for vehicle images and service history images.
- **Firestore**: The Firebase Firestore database used for service history records.
- **Supabase_Client**: The Supabase client used for Google OAuth for calendar integration.
- **ENV_Variable**: An environment variable injected at build time via `import.meta.env.VITE_*` (frontend) or `process.env.*` (backend).

---

## Phase 1: Discovery — What the App Does and Current State

### Requirement 1: Codebase Inventory and Gap Analysis

**User Story:** As the development team, we want a clear record of what is complete, what is partial, and what is missing, so that we can plan implementation work precisely.

#### Acceptance Criteria

**Completed Features (fully working as designed):**

1. THE API SHALL expose CRUD endpoints for vehicles: `GET /api/vehicles`, `GET /api/vehicles/:id`, `POST /api/vehicles`, `PUT /api/vehicles/updateVehicle/:id`, `DELETE /api/vehicles/deleteVehicle/:id`.
2. THE API SHALL expose CRUD endpoints for maintenance tasks: `GET /api/tasks`, `GET /api/tasks/byVehicle/:vehicleId`, `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id`.
3. THE Garage SHALL display the authenticated user's vehicles filtered by `user.nickname` from Auth0.
4. THE Garage SHALL allow vehicle deletion with optimistic UI update and toast confirmation.
5. THE Garage SHALL show a CSS animated car loader while data is being fetched.
6. THE AddNew_Form SHALL submit a new vehicle to the API with make (autosuggest), model (dropdown), year, modification, VIN, and image URL fields.
7. THE UpdateVehicle_Form SHALL pre-populate all fields from the API and submit updates.
8. THE Task_Dashboard SHALL list pending and completed tasks per vehicle with priority color-coding.
9. THE Task_Dashboard SHALL allow creating, completing, and deleting tasks.
10. THE Service_History SHALL upload images to Firebase_Storage and save records to Firestore, filtered by Auth0 `user.nickname`.
11. THE Google_Calendar SHALL authenticate via Supabase Google OAuth and create events on the user's primary Google Calendar.
12. THE Navbar SHALL render login/logout controls via Auth0.
13. THE Home page SHALL render a full landing page with sections, feature tiles, footer, and newsletter input.
14. THE redirectService utility SHALL open a brand-specific service booking URL in a new tab.

**Partially Completed Features:**

15. THE Navbar dropdown SHALL contain dead links: `/profile`, `/settings`, `/help`, and `/account-settings` routes do not exist in App.jsx and render nothing.
16. THE Garage2 component IS a near-duplicate of Garage with one broken link (`/maintenancetasks` instead of `/maintenancetask/:vehicleId`) and SHALL be removed or merged.
17. THE Vehicle_Card SHALL have a button labelled "Empty" that links to `/servicehistory` — this is a placeholder with no meaningful label or distinct destination.
18. THE Task_Dashboard SHALL use `location.reload()` after marking a task complete instead of a React state update, causing a full page reload.
19. THE Task_Dashboard SHALL use a mix of `axios` and `fetch` for API calls inconsistently.
20. THE Google_Calendar component SHALL contain a reference to an undefined variable `starst` (typo of `start`) in the `googleSignIn` error handler.
21. THE Service_History page SHALL call `location.reload()` after adding a record instead of a React state update.
22. THE AddNew_Form SHALL accept image as a raw URL string rather than using the Firebase_Storage upload that exists in `firebase.js`.
23. THE UpdateVehicle_Form SHALL accept image as a raw URL string rather than using Firebase_Storage upload.
24. THE Vehicle model schema SHALL define `image` as `{ data: Buffer, contentType: String }` (binary) but the API and frontend treat it as a plain URL string — these are inconsistent.
25. THE dbConn.js utility IS imported nowhere and the `connectDB` function body is incomplete (missing a `.catch()` and no `module.exports`), making it dead code.
26. THE backend server.js SHALL hard-code MongoDB Atlas credentials directly in source instead of reading from ENV_Variables.

**Stub / Empty Pages:**

27. THE About page SHALL contain generic placeholder text, a broken image reference (`img/about.jpg`), and Lorem Ipsum service descriptions — no Auto Sentry-specific content.
28. THE Services page SHALL render only a centered `<h1>Services</h1>` with no content.
29. THE Contact page SHALL render only a centered `<h1>Contact Us</h1>` with no content.
30. THE LoginForm page SHALL render a static HTML form with no Auth0 wiring — the "Login with Auth0" button has no `onClick` handler.
31. THE SignupForm page SHALL import `'./SignupForm'` (missing `.css` extension) and the form has no logic, no Auth0 wiring, and no validation.

**Missing Routes / Pages:**

32. THE App SHALL have no routes for `/profile`, `/settings`, `/help` — Navbar dropdown links to these routes silently fail (no 404 page shown).
33. THE App SHALL have no 404 / catch-all route, so unmatched URLs render only the Navbar with a blank body.

**Missing Features (documented in README but not implemented):**

34. THE App SHALL have no in-app notification system beyond React Toastify (README mentions "real-time notifications" — no WebSocket or polling mechanism exists).
35. THE Service_History page SHALL have no delete or edit capability for existing records.
36. THE Service_History page SHALL have no vehicle association — records are user-scoped only, not linked to a specific vehicle.
37. THE Task_Dashboard SHALL have a calendar icon that navigates to `/Googlecalender` but passes no task data — the calendar page cannot pre-populate event details from a task.

**Security / Configuration Issues:**

38. THE frontend source files SHALL contain hardcoded API keys and credentials: Auth0 `clientId`, Firebase `apiKey` values, and Supabase `anon key` are in committed source code.
39. THE backend server.js SHALL contain hardcoded MongoDB Atlas credentials including username and password in committed source code.
40. THE API SHALL have no authentication middleware — any client can create, update, or delete any vehicle or task without being authenticated.
41. THE API SHALL have no input validation or sanitization on any endpoint.
42. THE VIN field SHALL be stored as a `Number` type in the schema, which truncates leading zeros and cannot represent the full 17-character alphanumeric VIN format.

**Code Quality Issues:**

43. THE updateVehicle component SHALL be named with a lowercase first letter (`updateVehicle`), violating React component naming conventions.
44. THE Navbar SHALL use deprecated `activeClassName` prop (removed in React Router v6).
45. THE Garage and Garage2 SHALL render two `<ToastContainer />` instances, causing duplicate toast notifications.
46. THE frontend SHALL install and import both `@auth0/auth0-react` and a non-functional local `LoginForm`/`SignupForm` that are never connected — the Auth0 provider IS the auth system but the login/signup pages are disconnected stubs.
47. THE package.json SHALL list `@supabase/auth-helpers-react`, `@auth0/auth0-react`, `styled-components`, `react-hook-form`, `uuid`, and `reactstrap` as dependencies — several of these (`styled-components`, `react-hook-form`, `uuid`, `reactstrap`) appear unused or minimally used.

**Missing UX / Polish:**

48. THE App SHALL have no loading states on form submissions (AddNew, UpdateVehicle, Service History add).
49. THE App SHALL have no error messages displayed to the user when API calls fail (only `console.error` logging).
50. THE Garage SHALL render an empty state (only the "Add New Car" button) with no prompt or message when the user has no vehicles.
51. THE Task_Dashboard SHALL render a blank list with no empty state message when no tasks exist.
52. THE Service_History SHALL render a blank list with no empty state message when no records exist.
53. THE Home page newsletter subscription form SHALL have no submission handler.
54. THE Home page feature tiles "Explore Page" links SHALL point to `/` instead of relevant pages.
55. THE Navbar SHALL render a hamburger icon (`FaBars`) that has no `onClick` handler and no mobile menu behavior.

**Missing Accessibility:**

56. THE Garage SVG loader SHALL use `fill-rule` as a string attribute instead of `fillRule` (JSX prop), causing a React warning and potential rendering issues.
57. THE Vehicle_Card delete button SHALL use an `<a>` element with `onClick` instead of a `<button>`, which is not keyboard-accessible.
58. THE App SHALL have no `aria-label` attributes on icon-only buttons throughout the interface.
59. THE App SHALL have no skip-navigation link for keyboard users.

**Missing Tests:**

60. THE frontend SHALL have no test files — no unit, integration, or end-to-end tests exist.
61. THE backend SHALL have no test files.
62. THE backend package.json `test` script SHALL output `"Error: no test specified"` — no test runner is configured.

---

## Phase 2: Prioritized Gap Analysis

### Requirement 2: Critical Blockers (Must Fix Before Production)

**User Story:** As a developer, I want all critical bugs and security issues resolved, so that the application is safe and functional for real users.

#### Acceptance Criteria

1. WHEN the backend starts, THE API SHALL read MongoDB connection strings from ENV_Variables (`process.env.MONGO_URI`, `process.env.MONGO_TASKS_URI`) instead of hard-coded values.
2. WHEN the frontend builds, THE App SHALL read Auth0 domain, clientId, Firebase API keys, and Supabase URL/key from `import.meta.env.VITE_*` ENV_Variables instead of hard-coded values.
3. THE App SHALL provide a `.env.example` file in the frontend directory documenting all required `VITE_*` variables.
4. WHEN a user attempts to access a garage, task, or service history endpoint without authentication, THE API SHALL return a 401 Unauthorized response.
5. WHEN invalid data is submitted to `POST /api/vehicles` or `POST /api/tasks`, THE API SHALL return a 400 Bad Request with a descriptive validation error message.
6. THE Vehicle model SHALL redefine the `image` field as `type: String` (URL) to match the actual storage pattern used by the frontend.
7. THE Vehicle model SHALL redefine the `vin` field as `type: String` to correctly store the full 17-character alphanumeric VIN.
8. WHEN `googleSignIn` fails in the Google_Calendar component, THE App SHALL reference the defined variable `start` instead of the undefined variable `starst`.
9. THE Garage2 component file SHALL be removed as dead/duplicate code.
10. THE dbConn.js file SHALL be removed or completed and properly exported, as it is currently dead code that is never imported.

### Requirement 3: High-Priority Feature Completion

**User Story:** As a user, I want all advertised features to actually work, so that the application matches its documented behavior.

#### Acceptance Criteria

1. WHEN the user clicks "Login" or "Login with Auth0" on the LoginForm page, THE LoginForm SHALL call Auth0's `loginWithRedirect()` function.
2. WHEN the user visits `/sign-up`, THE SignupForm SHALL redirect to Auth0's universal login signup page rather than showing a disconnected static form.
3. WHEN a task is marked complete in the Task_Dashboard, THE Task_Dashboard SHALL update state locally without triggering `location.reload()`.
4. WHEN a service record is added in Service_History, THE Service_History SHALL update the displayed list locally without triggering `location.reload()`.
5. WHEN a user has no vehicles in the Garage, THE Garage SHALL display an empty state message prompting the user to add their first vehicle.
6. WHEN a user has no tasks in the Task_Dashboard, THE Task_Dashboard SHALL display an empty state message for both the upcoming and completed tabs.
7. WHEN a user has no service records in Service_History, THE Service_History SHALL display an empty state message.
8. WHEN an API call fails in the Garage, THE Garage SHALL display a user-visible error message rather than only logging to the console.
9. WHEN an API call fails in the Task_Dashboard, THE Task_Dashboard SHALL display a user-visible error message.
10. WHEN a Firebase operation fails in Service_History, THE Service_History SHALL display a user-visible error message.
11. THE App SHALL define a catch-all route that renders a 404 page for unmatched URLs.
12. WHEN the user navigates to `/profile`, `/settings`, or `/help` from the Navbar dropdown, THE App SHALL render a meaningful page or redirect gracefully rather than a blank screen.
13. THE Navbar mobile hamburger icon SHALL have an `onClick` handler that toggles a mobile menu open and closed.
14. WHEN a form (AddNew, UpdateVehicle, Service History) is submitting, THE App SHALL display a loading indicator and disable the submit button.

### Requirement 4: Medium-Priority Polish and Consistency

**User Story:** As a user, I want a polished, consistent experience across all pages, so that the application feels professional and complete.

#### Acceptance Criteria

1. THE About page SHALL display Auto Sentry-specific content describing the product, team, or mission rather than Lorem Ipsum placeholder text.
2. THE Services page SHALL display a meaningful description of the services Auto Sentry offers rather than a blank page.
3. THE Contact page SHALL display a functional contact form or contact information rather than a blank page.
4. THE Home page feature tile "Explore Page" links SHALL navigate to the relevant pages (`/services`, `/garage`, `/Googlecalender`) rather than pointing to `/`.
5. THE Home page newsletter subscription form SHALL call a handler that validates the email input and shows a confirmation toast.
6. THE updateVehicle component SHALL be renamed to `UpdateVehicle` to comply with React component naming conventions.
7. THE Navbar SHALL remove deprecated `activeClassName` props and use the React Router v6 `className` callback pattern instead.
8. THE Garage SHALL remove the duplicate `<ToastContainer />` so only one instance renders per page.
9. THE Vehicle_Card delete button SHALL use a `<button>` element rather than an `<a>` element.
10. THE Task_Dashboard SHALL use `axios` consistently for all API calls, removing the mixed `fetch` usage.
11. THE Vehicle_Card "Empty" button SHALL either be replaced with a meaningful feature (e.g., "Add Note" or "View Details") or removed.
12. WHEN the user adds a vehicle via AddNew_Form, THE AddNew_Form SHALL support Firebase_Storage image upload rather than requiring a raw URL string.

### Requirement 5: Low-Priority Improvements (Nice to Have)

**User Story:** As a developer, I want the codebase to be clean and testable, so that future maintenance is easier.

#### Acceptance Criteria

1. THE App SHALL remove unused dependencies from `package.json` (`styled-components`, `reactstrap`, `uuid` if unused) to reduce bundle size.
2. THE frontend SHALL include a `vite.config.js` proxy configuration to forward `/api` requests to `http://localhost:5000` during development, removing hardcoded `http://localhost:5000` base URLs from all components.
3. WHEN the Google_Calendar component encounters a sign-in error, THE Google_Calendar SHALL display a user-friendly error message rather than calling `alert()`.
4. THE Service_History SHALL support deleting a service record from Firestore.
5. THE Service_History records SHALL include a `vehicleId` field so records can be scoped to a specific vehicle.
6. THE Task_Dashboard calendar icon link SHALL pass task details (name, due date) as query parameters to the Google_Calendar page so the event form can be pre-populated.
7. THE App SHALL add `aria-label` attributes to all icon-only interactive elements (delete buttons, edit buttons, action icons).
8. THE App SHALL add a skip-navigation link before the Navbar for keyboard accessibility.
9. THE Garage SVG loader SHALL use the JSX prop `fillRule` instead of the HTML attribute string `fill-rule`.

---

## Phase 3: Prioritized Implementation Plan

### Requirement 6: Milestone 1 — Security and Critical Bug Fixes

**User Story:** As a developer, I want all security vulnerabilities and crash-inducing bugs fixed first, so that no sensitive credentials are exposed and the app does not crash.

#### Acceptance Criteria

1. WHEN Milestone 1 is complete, THE backend SHALL read all database credentials from `.env` using `process.env.*`, with no credentials in source files.
2. WHEN Milestone 1 is complete, THE frontend SHALL read all third-party credentials from `.env` using `import.meta.env.VITE_*`, with no credentials in source files.
3. WHEN Milestone 1 is complete, THE Google_Calendar component SHALL compile without referencing the undefined variable `starst`.
4. WHEN Milestone 1 is complete, THE Vehicle model SHALL define `image` as `String` and `vin` as `String`.
5. WHEN Milestone 1 is complete, THE Garage2 duplicate file SHALL be deleted.
6. WHEN Milestone 1 is complete, THE dbConn.js dead-code file SHALL be removed or replaced with a properly exported utility used by server.js.

**Milestone 1 Task Breakdown:**
- Extract all backend credentials to `.env` and load via `dotenv`
- Create frontend `.env` and `.env.example` with all `VITE_*` variables
- Update `main.jsx`, `firebase.js`, `Historyconfig.js` to use `import.meta.env`
- Fix typo `starst` → `start` in `GoogleCalender.jsx`
- Update `vehicles.model.js`: change `image` to `String`, `vin` to `String`
- Delete `Garage2.jsx` and `Garage2.css`
- Remove or rewrite `dbConn.js`

### Requirement 7: Milestone 2 — Core UX Completion

**User Story:** As a user, I want all core features to work end-to-end without page reloads, blank screens, or broken buttons, so that I can use the app for its intended purpose.

#### Acceptance Criteria

1. WHEN Milestone 2 is complete, THE LoginForm page SHALL wire the Auth0 `loginWithRedirect()` call to its submit buttons.
2. WHEN Milestone 2 is complete, THE SignupForm page SHALL wire Auth0 registration flow to its submit button.
3. WHEN Milestone 2 is complete, THE Task_Dashboard SHALL update task status via local state without page reload.
4. WHEN Milestone 2 is complete, THE Service_History SHALL update the record list via local state without page reload.
5. WHEN Milestone 2 is complete, THE App SHALL include a 404 catch-all route.
6. WHEN Milestone 2 is complete, THE Navbar dropdown links (`/profile`, `/settings`, `/help`) SHALL resolve to stub pages rather than blank screens.
7. WHEN Milestone 2 is complete, THE Navbar hamburger icon SHALL function as a toggle for the mobile navigation menu.
8. WHEN Milestone 2 is complete, THE Garage, Task_Dashboard, and Service_History pages SHALL show empty state UI when their lists are empty.
9. WHEN Milestone 2 is complete, THE Garage, Task_Dashboard, and Service_History pages SHALL display user-visible error messages on API/Firebase failures.
10. WHEN Milestone 2 is complete, form submit buttons in AddNew_Form, UpdateVehicle_Form, and Service_History SHALL be disabled and show a spinner while the submission is in progress.

**Milestone 2 Task Breakdown:**
- Wire LoginForm and SignupForm to Auth0
- Replace `location.reload()` in TaskDashboard with state updates
- Replace `location.reload()` in VehicleServiceHistory with state updates
- Add 404 route to App.jsx
- Create stub `/profile`, `/settings`, `/help` pages and routes
- Implement Navbar hamburger toggle for mobile
- Add empty state components to Garage, TaskDashboard, VehicleServiceHistory
- Add error boundary or error state UI to Garage, TaskDashboard, VehicleServiceHistory
- Add loading state and button disable to form submissions

### Requirement 8: Milestone 3 — Content, Polish, and Code Quality

**User Story:** As a user and developer, I want all pages to have real content, consistent code style, and no dead code, so that the app looks professional and the codebase is maintainable.

#### Acceptance Criteria

1. WHEN Milestone 3 is complete, THE About page SHALL display real Auto Sentry content.
2. WHEN Milestone 3 is complete, THE Services page SHALL display real content describing Auto Sentry's service offerings.
3. WHEN Milestone 3 is complete, THE Contact page SHALL display a functional contact form or meaningful contact details.
4. WHEN Milestone 3 is complete, THE Home page tile links SHALL point to meaningful routes.
5. WHEN Milestone 3 is complete, THE Home page newsletter form SHALL handle submission with email validation and a toast.
6. WHEN Milestone 3 is complete, THE Navbar SHALL not use deprecated `activeClassName` props.
7. WHEN Milestone 3 is complete, THE Garage page SHALL render only one `<ToastContainer />` instance.
8. WHEN Milestone 3 is complete, THE Vehicle_Card delete action SHALL use a `<button>` element.
9. WHEN Milestone 3 is complete, THE Task_Dashboard SHALL use `axios` for all API calls.
10. WHEN Milestone 3 is complete, THE updateVehicle component SHALL be renamed `UpdateVehicle`.
11. WHEN Milestone 3 is complete, THE Garage SVG SHALL use `fillRule` JSX prop.
12. WHEN Milestone 3 is complete, THE Vehicle_Card "Empty" button SHALL be replaced or removed.
13. WHEN Milestone 3 is complete, THE vite.config.js SHALL include an `/api` proxy to eliminate hardcoded `http://localhost:5000` base URLs.

### Requirement 9: Milestone 4 — Testing Baseline

**User Story:** As a developer, I want a minimum test suite covering critical paths, so that regressions can be caught before deployment.

#### Acceptance Criteria

1. THE frontend SHALL configure Vitest with React Testing Library as the test runner.
2. THE backend SHALL configure Jest (or Vitest) as the test runner.
3. WHEN the Garage component mounts with a mocked authenticated user and API response, THE Garage SHALL render the correct number of Vehicle_Cards.
4. WHEN the AddNew_Form is submitted with valid data, THE AddNew_Form SHALL call the API `POST /api/vehicles` endpoint with the correct payload.
5. WHEN the Task_Dashboard receives a list of tasks, THE Task_Dashboard SHALL render pending tasks in the "Upcoming" tab and completed tasks in the "Completed" tab.
6. WHEN a task is marked complete, THE Task_Dashboard SHALL move it to the completed list without a page reload.
7. WHEN `POST /api/vehicles` is called with a missing required field, THE API SHALL return status 400.
8. WHEN `DELETE /api/vehicles/deleteVehicle/:id` is called with a valid ID, THE API SHALL return status 200.
9. WHEN `GET /api/tasks/byVehicle/:vehicleId` is called, THE API SHALL return only tasks matching the given vehicleId.
10. THE Service_History round-trip SHALL be testable: adding a record and then fetching records SHALL return a list that includes the added record.

### Requirement 10: Milestone 5 — Accessibility and Remaining Enhancements

**User Story:** As a user relying on assistive technology or keyboard navigation, I want the app to meet basic accessibility standards, so that I can use all features.

#### Acceptance Criteria

1. THE App SHALL include a visually-hidden skip-navigation link as the first focusable element.
2. THE App SHALL add `aria-label` attributes to all icon-only buttons (delete, edit, complete, calendar, etc.).
3. WHEN a modal or dropdown is open, THE App SHALL manage focus appropriately and close on Escape key press.
4. WHERE color is the only indicator of task priority, THE Task_Dashboard SHALL also include a text label or icon.
5. THE Service_History SHALL support deleting an existing record with a confirmation prompt.
6. THE Task_Dashboard calendar link SHALL pre-populate the Google_Calendar form with the task name and due date.
7. WHERE unused packages remain in `package.json`, THE App SHALL remove them and verify the build still passes.
