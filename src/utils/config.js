// src/config.js

export const CONFIG = {
  SPOTIFY_BASE_URL: import.meta.env.VITE_SPOTIFY_BASE_URL,
  CLIENT_ID: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
  CLIENT_SECRET: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
  REDIRECT_URI: import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
  SPOTIFY_AUTH_URL: import.meta.env.VITE_SPOTIFY_AUTH_URL,
  SPOTIFY_TOKEN_URL: import.meta.env.VITE_SPOTIFY_TOKEN_URL,
};
