export const buildAuthHeader = token =>
  token ? { Authorization: `Bearer ${token}` } : {};
