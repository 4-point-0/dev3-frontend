export function getDefaultExpires() {
  const now = new Date();
  const expires = new Date(new Date().setFullYear(now.getFullYear() + 10));

  return expires.toISOString();
}
