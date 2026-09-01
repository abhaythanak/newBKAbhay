export const authUtils = {
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },
  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      // Redirect to login page
      window.location.href = '/login';
    }
  }
};
