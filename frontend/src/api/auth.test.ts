import { saveToken, getToken, clearToken } from './auth';

describe('auth token helpers', () => {
  beforeEach(() => localStorage.clear());

  it('saves and retrieves a token', () => {
    saveToken('my-token');
    expect(getToken()).toBe('my-token');
  });

  it('returns null when no token saved', () => {
    expect(getToken()).toBeNull();
  });

  it('clears the token', () => {
    saveToken('my-token');
    clearToken();
    expect(getToken()).toBeNull();
  });
});
