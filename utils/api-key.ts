export function getDefaultExpires() {
  const now = new Date();
  const expires = new Date(new Date().setFullYear(now.getFullYear() + 10));

  return expires.toISOString();
}

export function isExpired(expires?: string) {
  if (!expires) {
    return false;
  }

  return new Date(expires).valueOf() < Date.now();
}

export function formatExpired(expires?: string) {
  if (!expires) {
    return;
  }

  return new Date(expires).toLocaleString();
}
