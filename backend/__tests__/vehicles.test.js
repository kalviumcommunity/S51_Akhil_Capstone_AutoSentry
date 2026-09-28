/**
 * Backend property-based tests — Vehicles API
 * Feature: auto-sentry-completion, Property 14
 * Validates: Requirements 9.7, 9.8
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const fc = require('fast-check');

const createApp = require('../app');

// ── Inline model (bound to the in-memory connection) ─────────────────────────
// We re-declare the schema here so it is bound to the test connection rather
// than the real Atlas connection that server.js creates on import.

const VehicleSchema = new mongoose.Schema(
  {
    user:         { type: String, required: true },
    make:         { type: String, required: true },
    model:        { type: String, required: true },
    year:         { type: Number, required: true },
    modification: { type: String, required: true },
    vin:          { type: String, required: true },
    image:        { type: String, required: false },
  },
  { timestamps: true }
);

let mongod;
let Vehicle;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  // Register the model on the active test connection
  Vehicle = mongoose.model('TestVehicle', VehicleSchema);
  // Provide a stub for MaintenanceTask (not used in vehicles tests)
  const stubTaskSchema = new mongoose.Schema({ vehicleId: String });
  const MaintenanceTask = mongoose.model('TestTaskForVehicles', stubTaskSchema);
  app = createApp(Vehicle, MaintenanceTask);
});

afterEach(async () => {
  await Vehicle.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const REQUIRED_FIELDS = ['user', 'make', 'model', 'year', 'modification', 'vin'];

/** Build a complete valid vehicle payload. */
function validVehicle(overrides = {}) {
  return {
    user:         'testuser',
    make:         'Toyota',
    model:        'Camry',
    year:         2020,
    modification: 'Stock',
    vin:          '1HGBH41JXMN109186',
    ...overrides,
  };
}

// ── Property 14 ───────────────────────────────────────────────────────────────
// Feature: auto-sentry-completion, Property 14
// For any POST body missing one required field (user, make, model, year,
// modification, vin), the API must return HTTP 400.

describe('POST /api/vehicles', () => {
  test(
    // Feature: auto-sentry-completion, Property 14
    'P14: returns 400 when any single required field is missing',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          // Pick one required field to omit
          fc.constantFrom(...REQUIRED_FIELDS),
          async (omittedField) => {
            const payload = validVehicle();
            delete payload[omittedField];

            const res = await request(app)
              .post('/api/vehicles')
              .send(payload)
              .set('Content-Type', 'application/json');

            expect(res.status).toBe(400);
          }
        ),
        { numRuns: 100 }
      );
    }
  );

  test('returns 201 and persists vehicle when all required fields are present', async () => {
    const payload = validVehicle();
    const res = await request(app)
      .post('/api/vehicles')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      user: 'testuser',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      vin: '1HGBH41JXMN109186',
    });
  });
});

// ── Unit test: DELETE /api/vehicles/deleteVehicle/:id (Req 9.8) ───────────────
// Feature: auto-sentry-completion, Property — unit test

describe('DELETE /api/vehicles/deleteVehicle/:id', () => {
  test('returns 200 when a valid vehicle id is deleted', async () => {
    // Insert a vehicle directly via model
    const vehicle = await Vehicle.create(validVehicle());

    const res = await request(app).delete(
      `/api/vehicles/deleteVehicle/${vehicle._id}`
    );

    expect(res.status).toBe(200);
  });

  test('returns 404 when vehicle id does not exist', async () => {
    const nonExistentId = new mongoose.Types.ObjectId();
    const res = await request(app).delete(
      `/api/vehicles/deleteVehicle/${nonExistentId}`
    );

    expect(res.status).toBe(404);
  });
});
