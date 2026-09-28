import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    isAuthenticated: true,
    user: { nickname: 'testuser', name: 'Test User', email: 'test@example.com', picture: '' },
    loginWithRedirect: vi.fn(),
    logout: vi.fn(),
  }),
  Auth0Provider: ({ children }) => children,
}));

// Mock firebase to avoid env var errors
vi.mock('../firebase', () => ({
  storage: {},
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
}));

// Mock firebase/storage
vi.mock('firebase/storage', () => ({
  getStorage: vi.fn(),
  ref: vi.fn(),
  uploadBytesResumable: vi.fn(),
  getDownloadURL: vi.fn(),
}));

// Mock firestore used by Service History
vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(),
  collection: vi.fn(),
  addDoc: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  deleteDoc: vi.fn(),
  doc: vi.fn(),
}));

// Mock Supabase
vi.mock('@supabase/auth-helpers-react', () => ({
  useSession: vi.fn(() => null),
  useSupabaseClient: vi.fn(() => ({})),
  SessionContextProvider: ({ children }) => children,
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(() => Promise.resolve({ data: [] })),
    post: vi.fn(() => Promise.resolve({ data: {} })),
    put: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
  },
}));

describe('App structural tests', () => {
  it('renders exactly one ToastContainer', () => {
    render(<App />);

    // react-toastify renders a div with class "Toastify" for each ToastContainer
    const toastifyContainers = document.querySelectorAll('.Toastify');
    expect(toastifyContainers.length).toBe(1);
  });
});
