// Feature: auto-sentry-completion
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor, act, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fc from 'fast-check';
import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Shared mocks (hoisted — apply to the whole file)
// ─────────────────────────────────────────────────────────────────────────────

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(() => ({
    isAuthenticated: true,
    user: { nickname: 'testuser' },
  })),
  Auth0Provider: ({ children }) => children,
}));

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}));

vi.mock('../Garage.css', () => ({}));
vi.mock('../redirectService', () => ({ default: vi.fn() }));
vi.mock('react-icons/fa', () => ({ FaPlus: () => null, FaPen: () => null }));
vi.mock('react-icons/md', () => ({ MdDelete: () => null }));

// AddNew-specific mocks
vi.mock('../../../components/Add New/addnew.css', () => ({}));

vi.mock('react-autosuggest', () => ({
  default: ({ inputProps }) => {
    const { onChange: autosuggestOnChange, value, placeholder } = inputProps;
    return (
      <input
        data-testid="make-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => autosuggestOnChange(e, { newValue: e.target.value })}
      />
    );
  },
}));

vi.mock('../../../components/Add New/makesAndModels.js', () => ({
  default: {
    TestMake: ['TestModel1', 'TestModel2'],
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Component imports (after mocks)
// ─────────────────────────────────────────────────────────────────────────────
import Garage from '../Garage';
import AddNew from '../../../components/Add New/addnew';
import { useAuth0 } from '@auth0/auth0-react';

// ─────────────────────────────────────────────────────────────────────────────
// Arbitraries
// ─────────────────────────────────────────────────────────────────────────────
const vehicleArb = fc.record({
  _id: fc.uuid(),
  make: fc.string({ minLength: 1, maxLength: 20 }),
  model: fc.string({ minLength: 1, maxLength: 20 }),
  year: fc.integer({ min: 1900, max: 2025 }),
  modification: fc.string({ minLength: 1, maxLength: 20 }),
  image: fc.constant('https://test.com/img.jpg'),
  user: fc.constant('testuser'),
});

const vehicleFormArb = fc.record({
  make: fc.constant('TestMake'),
  model: fc.constant('TestModel1'),
  year: fc.integer({ min: 1900, max: 2025 }).map(String),
  modification: fc
    .string({ minLength: 1, maxLength: 20 })
    .filter((s) => s.trim().length > 0),
  vin: fc
    .string({ minLength: 17, maxLength: 17 })
    .filter((s) => /^[a-zA-Z0-9]{17}$/.test(s)),
  image: fc.constant('https://test.com/img.jpg'),
});

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function renderGarage() {
  return render(
    <MemoryRouter>
      <Garage />
    </MemoryRouter>
  );
}

function renderAddNew() {
  return render(
    <MemoryRouter>
      <AddNew />
    </MemoryRouter>
  );
}

function fill(input, value) {
  fireEvent.change(input, { target: { value } });
}

// ─────────────────────────────────────────────────────────────────────────────
// Property 11: Garage renders correct vehicle count
// Feature: auto-sentry-completion, Property 11
// Validates: Requirements 9.3
// ─────────────────────────────────────────────────────────────────────────────
describe('Property 11: Garage renders correct vehicle count', () => {
  afterEach(() => {
    vi.clearAllMocks();
    cleanup();
    // Restore default auth0 mock after each test
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { nickname: 'testuser' },
    });
  });

  it('renders exactly N vehicle-card elements for any array of N vehicles', async () => {
    // Validates: Requirements 9.3
    await fc.assert(
      fc.asyncProperty(
        fc.array(vehicleArb, { minLength: 0, maxLength: 6 }),
        async (vehicles) => {
          cleanup();
          vi.clearAllMocks();

          // Re-apply auth0 mock after clearAllMocks
          useAuth0.mockReturnValue({
            isAuthenticated: true,
            user: { nickname: 'testuser' },
          });

          // Ensure unique _id to avoid React key warnings
          const uniqueVehicles = vehicles.map((v, i) => ({ ...v, _id: `uid-${i}` }));

          axios.get.mockResolvedValueOnce({ data: uniqueVehicles });

          let container;
          await act(async () => {
            ({ container } = renderGarage());
          });

          await waitFor(
            () => {
              // When loading=false, vehicle-list is rendered
              const cards = container.querySelectorAll('.vehicle-card');
              expect(cards.length).toBe(uniqueVehicles.length);
            },
            { timeout: 3000 }
          );
        }
      ),
      { numRuns: 10, verbose: false }
    );
  }, 120000);
});

// ─────────────────────────────────────────────────────────────────────────────
// Property 12: AddNew POST body contains all original field values
// Feature: auto-sentry-completion, Property 12
// Validates: Requirements 9.4
// ─────────────────────────────────────────────────────────────────────────────
describe('Property 12: AddNew POST body contains all original field values', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
    cleanup();
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { nickname: 'testuser' },
    });
  });

  it('axios POST body matches the submitted form data for any valid vehicle input', async () => {
    // Validates: Requirements 9.4

    // Capture all post calls across runs so we can verify each one
    const postSpy = vi.spyOn(axios, 'post').mockResolvedValue({ data: { _id: 'new-id' } });

    await fc.assert(
      fc.asyncProperty(vehicleFormArb, async (formData) => {
        cleanup();
        postSpy.mockClear();

        useAuth0.mockReturnValue({
          isAuthenticated: true,
          user: { nickname: 'testuser' },
        });

        let container;
        act(() => {
          ({ container } = renderAddNew());
        });

        // Fill all fields synchronously (fireEvent is synchronous)
        const makeInput = screen.getByTestId('make-input');
        fill(makeInput, formData.make);

        const modelSelect = container.querySelector('select');
        fill(modelSelect, formData.model);
        fill(screen.getByPlaceholderText('Enter the Year'), formData.year);
        fill(screen.getByPlaceholderText('Enter the Modification'), formData.modification);
        fill(screen.getByPlaceholderText('Enter the VIN'), formData.vin);
        fill(screen.getByPlaceholderText('Paste the Vehicle Image URL'), formData.image);

        // Submit the form — triggers handleSubmit which calls axios.post synchronously
        act(() => {
          fireEvent.submit(container.querySelector('form'));
        });

        // axios.post is called synchronously inside handleSubmit before any awaits
        expect(postSpy).toHaveBeenCalledTimes(1);

        // Assert the POST body contains all original field values
        const [url, postedBody] = postSpy.mock.calls[0];
        expect(url).toBe('/api/vehicles');
        expect(postedBody.make).toBe(formData.make);
        expect(postedBody.model).toBe(formData.model);
        expect(postedBody.year).toBe(formData.year);
        expect(postedBody.modification).toBe(formData.modification);
        expect(postedBody.vin).toBe(formData.vin);
        expect(postedBody.image).toBe(formData.image);
        // user field comes from mocked useAuth0 -> user.nickname = 'testuser'
        expect(postedBody.user).toBe('testuser');
      }),
      { numRuns: 10, verbose: false }
    );
  }, 60000);
});
