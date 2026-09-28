import { render, screen, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Garage from '../Garage';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: vi.fn(() => ({
    isAuthenticated: true,
    user: { nickname: 'testuser', name: 'Test User', email: 'test@example.com' },
    loginWithRedirect: vi.fn(),
  })),
}));

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    delete: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock('react-toastify', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
  ToastContainer: () => null,
}));

vi.mock('../redirectService', () => ({ default: vi.fn() }));

describe('Garage structural tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the auth0 mock after clearAllMocks
    useAuth0.mockReturnValue({
      isAuthenticated: true,
      user: { nickname: 'testuser', name: 'Test User', email: 'test@example.com' },
      loginWithRedirect: vi.fn(),
    });
  });

  it('renders the delete action as a <button> element (not an <a>)', async () => {
    const vehicle = {
      _id: 'vehicle-1',
      user: 'testuser',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      modification: 'Stock',
      image: 'https://test.com/car.jpg',
    };

    axios.get.mockResolvedValue({ data: [vehicle] });

    let result;
    await act(async () => {
      result = render(
        <MemoryRouter>
          <Garage />
        </MemoryRouter>
      );
    });

    console.log('HTML after act:', result.container.innerHTML.substring(0, 300));

    await waitFor(
      () => {
        expect(screen.getByLabelText('Delete vehicle')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    const deleteElement = screen.getByLabelText('Delete vehicle');
    expect(deleteElement.tagName).toBe('BUTTON');
  }, 10000);
});
