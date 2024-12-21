import { CONFIG } from "./environment";
const SCOPES = "user-library-read user-read-playback-state";

const generateRandomString = (length) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};
const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};
const base64encode = (input) => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const getSpotifyAuthorizationEndpoint = async () => {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64encode(hashed);
  localStorage.setItem("code_verifier", codeVerifier);
  window.localStorage.setItem("code_verifier", codeVerifier);
  const authUrl = new URL(CONFIG.spotifyAuthorizationUrl);
  authUrl.search = new URLSearchParams({
    response_type: "code",
    client_id: CONFIG.spotifyClientId,
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    redirect_uri: CONFIG.redirectUri,
    scope: SCOPES,
  });
  return authUrl.toString();
};
