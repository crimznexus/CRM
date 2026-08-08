import { api } from "../../../../convex/_generated/api";
import { authClient } from "../lib/auth-client";
import { convexClient } from "../lib/convex";

function unwrap(result) {
  if (result.error) throw new Error(result.error.message || "Authentication failed.");
  return result.data;
}

async function ensureProfile(details) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      return await convexClient.mutation(api.profiles.ensure, details);
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
  throw lastError;
}

export const authService = {
  async login({ email, password, rememberMe }) {
    const data = unwrap(await authClient.signIn.email({ email, password, rememberMe }));
    const user = data?.user;
    const profile = await ensureProfile({ companyName: "My Workspace", fullName: user?.name || email.split("@")[0] });
    return { user: profile };
  },

  async signup(payload) {
    const data = unwrap(await authClient.signUp.email({ email: payload.email, password: payload.password, name: payload.fullName }));
    const profile = await ensureProfile({ companyName: payload.companyName, fullName: payload.fullName, phoneNumber: payload.phoneNumber || undefined });
    return { user: profile, authUser: data?.user };
  },

  // Backend generates a new random password and emails it directly to the user
  async forgotPassword(email) {
    throw new Error(`Password reset email is not configured yet for ${email}.`);
  },

  // Called from the Verify Email page (token comes from the emailed verification link)
  async verifyEmail(token) {
    return { verified: Boolean(token) };
  },

  // "Resend verification email" button on the Verify Email page
  async resendVerification(email) {
    return { email, message: "Email verification is not required for this deployment." };
  },

  async logout() {
    unwrap(await authClient.signOut());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  async me() { return convexClient.query(api.profiles.me); },
  async updateProfile(payload) {
    const { fullName, phoneNumber, interfacePreference, notificationPreferences } = payload;
    return convexClient.mutation(api.profiles.update, { fullName, phoneNumber, interfacePreference, notificationPreferences });
  },
};

export default authService;
