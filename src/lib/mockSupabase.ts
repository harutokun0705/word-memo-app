import { Session, User, AuthError } from '@supabase/supabase-js';

// Mock User
const mockUser: User = {
  id: 'mock-user-id',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'demo@example.com',
  phone: '',
  role: 'authenticated',
  updated_at: new Date().toISOString(),
};

// Mock Session
const mockSession: Session = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
};

export const createMockSupabaseClient = () => {
  let currentSession: Session | null = null;
  let authListener: ((event: string, session: Session | null) => void) | null = null;

  // Load from local storage to persist mock session across reloads
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('mock-auth-session');
    if (stored) {
      currentSession = JSON.parse(stored);
    }
  }

  const notify = (event: 'SIGNED_IN' | 'SIGNED_OUT', session: Session | null) => {
    if (authListener) {
      authListener(event, session);
    }
  };

  return {
    auth: {
      getSession: async () => {
        return { data: { session: currentSession }, error: null };
      },
      onAuthStateChange: (callback: (event: string, session: Session | null) => void) => {
        authListener = callback;
        // Immediate callback with current state
        callback(currentSession ? 'SIGNED_IN' : 'SIGNED_OUT', currentSession);
        return { data: { subscription: { unsubscribe: () => { authListener = null; } } } };
      },
      signInWithPassword: async ({ email, password }: any) => {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (password === 'error') {
           return { data: { user: null, session: null }, error: { message: 'Invalid login credentials' } as AuthError };
        }

        currentSession = { ...mockSession, user: { ...mockUser, email } };
        if (typeof window !== 'undefined') {
          localStorage.setItem('mock-auth-session', JSON.stringify(currentSession));
        }
        notify('SIGNED_IN', currentSession);
        return { data: { user: currentSession.user, session: currentSession }, error: null };
      },
      signUp: async ({ email, password }: any) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        // For mock, we just auto-login or say success
        // Simulating "check email" flow by NOT logging in
        return { data: { user: { ...mockUser, email }, session: null }, error: null };
      },
      signOut: async () => {
        await new Promise(resolve => setTimeout(resolve, 200));
        currentSession = null;
        if (typeof window !== 'undefined') {
          localStorage.removeItem('mock-auth-session');
        }
        notify('SIGNED_OUT', null);
        return { error: null };
      },
    },
  };
};
