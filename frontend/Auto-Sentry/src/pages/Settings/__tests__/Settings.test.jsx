import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Settings from '../Settings';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { nickname: 'testuser', name: 'Test User', email: 'test@example.com' },
    loginWithRedirect: vi.fn(),
  }),
}));

describe('Settings page', () => {
  it('renders the Settings page heading', () => {
    render(
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /settings/i })).toBeInTheDocument();
  });

  it('renders the settings stub content', () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    expect(screen.getByText(/settings coming soon/i)).toBeInTheDocument();
  });

  it('renders a back link to home', () => {
    render(
      <MemoryRouter>
        <Settings />
      </MemoryRouter>
    );

    const backLink = screen.getByRole('link');
    expect(backLink).toHaveAttribute('href', '/');
  });
});
