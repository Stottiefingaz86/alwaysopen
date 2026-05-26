/** Device-local login fields when "Remember me" is enabled (admin only). */

export const LOGIN_REMEMBER_KEY = "ringsaway-login-remember";
export const LOGIN_EMAIL_KEY = "ringsaway-login-email";
const LOGIN_PASSWORD_KEY = "ringsaway-login-password-v1";

function encodePassword(password: string) {
  if (typeof window === "undefined") return "";
  try {
    return btoa(unescape(encodeURIComponent(password)));
  } catch {
    return "";
  }
}

function decodePassword(encoded: string) {
  try {
    return decodeURIComponent(escape(atob(encoded)));
  } catch {
    return "";
  }
}

export function readRememberPreference(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(LOGIN_REMEMBER_KEY) !== "false";
}

export function readSavedLoginFields(): {
  email: string;
  password: string;
  rememberMe: boolean;
} {
  if (typeof window === "undefined") {
    return { email: "", password: "", rememberMe: true };
  }

  const rememberMe = readRememberPreference();
  if (!rememberMe) {
    return { email: "", password: "", rememberMe: false };
  }

  const email = localStorage.getItem(LOGIN_EMAIL_KEY) ?? "";
  const encoded = localStorage.getItem(LOGIN_PASSWORD_KEY);
  const password = encoded ? decodePassword(encoded) : "";

  return { email, password, rememberMe: true };
}

export function persistLoginFields(
  email: string,
  password: string,
  rememberMe: boolean
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(LOGIN_REMEMBER_KEY, rememberMe ? "true" : "false");

  if (rememberMe) {
    localStorage.setItem(LOGIN_EMAIL_KEY, email);
    localStorage.setItem(LOGIN_PASSWORD_KEY, encodePassword(password));
  } else {
    localStorage.removeItem(LOGIN_EMAIL_KEY);
    localStorage.removeItem(LOGIN_PASSWORD_KEY);
  }
}

export function clearSavedLoginFields() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOGIN_EMAIL_KEY);
  localStorage.removeItem(LOGIN_PASSWORD_KEY);
}
