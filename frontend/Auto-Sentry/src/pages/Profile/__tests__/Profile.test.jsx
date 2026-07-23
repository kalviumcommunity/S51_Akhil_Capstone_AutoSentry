import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Profile from '../Profile';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { nickname: 'testuser', name: 'Test User', email: 'test@example.com' },
    loginWithRedirect: vi.fn(),
  }),
}));

describe('Profile page', () => {
  it('renders the Profile page heading', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /profile/i })).toBeInTheDocument();
  });

  it('displays the authenticated user name and email', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    expect(screen.getByText(/Test User/i)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/i)).toBeInTheDocument();
  });
});
