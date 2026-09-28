import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Contact from '../Contact';

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { nickname: 'testuser', name: 'Test User', email: 'test@example.com' },
    loginWithRedirect: vi.fn(),
  }),
}));

describe('Contact page', () => {
  it('renders a name input field', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
  });

  it('renders an email input field', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
  });

  it('renders a message input field', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    // textarea is queried as textbox by accessibility role
    expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
  });

  it('renders a submit button', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('renders a form with name, email, message fields and a submit button together', () => {
    render(
      <MemoryRouter>
        <Contact />
      </MemoryRouter>
    );

    const form = document.querySelector('form');
    expect(form).not.toBeNull();

    // All three inputs should exist within the form
    expect(form.querySelector('#name')).not.toBeNull();
    expect(form.querySelector('#email')).not.toBeNull();
    expect(form.querySelector('#message')).not.toBeNull();
    expect(form.querySelector('button[type="submit"]')).not.toBeNull();
  });
});
