export const buildAuthHeaders = token =>
  token ? { Authorization: `Bearer ${token}` } : {};
