import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { nickname: 'testuser', name: 'Test User', email: 'test@example.com' },
    loginWithRedirect: vi.fn(),
  }),
}));

describe('NotFound page', () => {
  it('renders 404 heading and message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });

  it('renders a link back to the home page', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole('link');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('renders when navigating to an unknown path via catch-all route', () => {
    const { Routes, Route } = require('react-router-dom');

    render(
      <MemoryRouter initialEntries={['/some/unknown/path']}>
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/404/i)).toBeInTheDocument();
  });
});
