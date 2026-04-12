export function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function getUserRoles(): string[] {
  const token = localStorage.getItem('token');
  if (!token) return [];

  const payload = parseJwt(token);
  return payload?.roles || [];
}

export function isModerator(): boolean {
  const roles = getUserRoles();
  return roles.includes('ROLE_MODERATOR') || roles.includes('ROLE_ADMIN');
}

export function isOnline(lastSeenAt: string): boolean {
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  return diff < 2 * 60 * 1000; // 2 minutes
}
