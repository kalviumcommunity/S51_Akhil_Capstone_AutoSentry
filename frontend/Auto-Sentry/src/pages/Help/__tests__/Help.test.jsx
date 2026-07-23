import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Help from '../Help';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { nickname: 'testuser', name: 'Test User', email: 'test@example.com' },
    loginWithRedirect: vi.fn(),
  }),
}));

describe('Help page', () => {
  it('renders the Help page heading', () => {
    render(
      <MemoryRouter initialEntries={['/help']}>
        <Routes>
          <Route path="/help" element={<Help />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /help/i })).toBeInTheDocument();
  });

  it('renders a back link to home', () => {
    render(
      <MemoryRouter>
        <Help />
      </MemoryRouter>
    );

    const links = screen.getAllByRole('link');
    const homeLink = links.find(l => l.getAttribute('href') === '/');
    expect(homeLink).toBeInTheDocument();
  });

  it('renders some descriptive content', () => {
    render(
      <MemoryRouter>
        <Help />
      </MemoryRouter>
    );

    // The help page should have some content beyond just the heading
    expect(screen.getByRole('heading', { name: /help/i })).toBeInTheDocument();
    expect(document.querySelector('p')).not.toBeNull();
  });
});
