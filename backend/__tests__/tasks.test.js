/**
 * Backend property-based tests — Tasks API
 * Feature: auto-sentry-completion, Property 15
 * Validates: Requirements 9.9
 */

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const request = require('supertest');
const fc = require('fast-check');

const createApp = require('../app');

// ── Inline schemas (bound to the in-memory connection) ───────────────────────
// Re-declared here so they are bound to the test connection, not the real Atlas
// connection that server.js creates on import.

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

const TaskSchema = new mongoose.Schema(
  {
    user:            { type: String, required: false },
    vehicleId:       { type: String, required: true },
    task:            { type: String, required: true },
    priority:        { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
    dueDate:         { type: Date,   required: true },
    taskDescription: { type: String, required: true },
    taskStatus:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

let mongod;
let Vehicle;
let MaintenanceTask;
let app;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  Vehicle = mongoose.model('TestVehicleForTasks', VehicleSchema);
  MaintenanceTask = mongoose.model('TestMaintenanceTask', TaskSchema);
  app = createApp(Vehicle, MaintenanceTask);
});

afterEach(async () => {
  await MaintenanceTask.deleteMany({});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Build a complete valid task payload for a given vehicleId. */
function validTask(vehicleId, overrides = {}) {
  return {
    vehicleId,
    task:            'Oil Change',
    priority:        'Medium',
    dueDate:         new Date('2025-06-01').toISOString(),
    taskDescription: 'Replace engine oil and filter',
    taskStatus:      false,
    ...overrides,
  };
}

// ── Property 15 ───────────────────────────────────────────────────────────────
// Feature: auto-sentry-completion, Property 15
// Seed N tasks for vehicleId A and M tasks for vehicleId B; assert
// GET /api/tasks/byVehicle/A returns exactly the tasks where vehicleId === A.

describe('GET /api/tasks/byVehicle/:vehicleId', () => {
  test(
    // Feature: auto-sentry-completion, Property 15
    'P15: returns only tasks matching the requested vehicleId',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          // N tasks for vehicle A: 1–8 tasks
          fc.integer({ min: 1, max: 8 }),
          // M tasks for vehicle B: 0–8 tasks
          fc.integer({ min: 0, max: 8 }),
          // Distinct vehicleId strings for A and B
          fc.string({ minLength: 4, maxLength: 12 }).filter(s => /^[a-z0-9]+$/.test(s)),
          fc.string({ minLength: 4, maxLength: 12 }).filter(s => /^[a-z0-9]+$/.test(s)),
          async (n, m, vehicleIdA, vehicleIdB) => {
            // Ensure A and B are different
            fc.pre(vehicleIdA !== vehicleIdB);

            // Seed N tasks for vehicle A and M tasks for vehicle B
            const tasksA = Array.from({ length: n }, (_, i) =>
              validTask(vehicleIdA, { task: `Task A-${i}` })
            );
            const tasksB = Array.from({ length: m }, (_, i) =>
              validTask(vehicleIdB, { task: `Task B-${i}` })
            );
            await MaintenanceTask.insertMany([...tasksA, ...tasksB]);

            const res = await request(app)
              .get(`/api/tasks/byVehicle/${vehicleIdA}`)
              .set('Accept', 'application/json');

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);

            // Must return exactly N tasks
            expect(res.body).toHaveLength(n);

            // Every returned task must belong to vehicleId A
            for (const task of res.body) {
              expect(task.vehicleId).toBe(vehicleIdA);
            }

            // Clean up between iterations
            await MaintenanceTask.deleteMany({});
          }
        ),
        { numRuns: 50 }
      );
    }
  );

  test('returns an empty array when no tasks exist for the vehicleId', async () => {
    const res = await request(app)
      .get('/api/tasks/byVehicle/nonexistent-vehicle-id')
      .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });
});
