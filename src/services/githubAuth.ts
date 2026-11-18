const TOKEN_KEY = "githubToken";

export function loadGithubToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY) || null;
  } catch {
    return null;
  }
}

/** Sauvegarde le token (nettoyé). Retourne le token enregistré, ou null si vide. */
export function saveGithubToken(rawToken: string): string | null {
  const token = rawToken.trim();
  if (!token) return null;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    // Stockage indisponible : le token reste seulement en mémoire (session)
  }
  return token;
}

export function clearGithubToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Stockage indisponible : rien à effacer
  }
}
