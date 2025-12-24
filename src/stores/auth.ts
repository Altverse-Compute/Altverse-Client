import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LoginProps, Profile, RegisterProps } from "../api/types";
import { ApiRequests } from "../api/requests";

export interface AuthState {
  token: string;
  valid: boolean;
  profile?: Profile;
  logged: boolean;

  validate: (token: string) => void;
  login: (obj: LoginProps) => Promise<string>;
  register: (obj: RegisterProps) => Promise<string>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      token: "",
      valid: false,
      logged: false,
      validate: async (token: string) => {
        if (token.length === 0) return;
        const response = await ApiRequests.check(token);

        if (response.successful) set({ valid: response.data.valid });
      },
      register: async (obj) => {
        const response = await ApiRequests.register(obj);

        if (response.successful) {
          set({
            valid: response.successful,
            token: response.data.token,
            profile: response.data.profile,
            logged: true,
          });
          return "";
        }
        return response.data.message;
      },
      login: async (obj) => {
        const response = await ApiRequests.login(obj);

        if (response.successful) {
          set({
            valid: response.successful,
            token: response.data.token,
            profile: response.data.profile,
            logged: true,
          });
          return "";
        }
        return response.data.message;
      },
      logout: async () => {
        ApiRequests.logout(get().token);
        set({ token: "", valid: false });
        console.log("logout");
      },
    }),
    {
      name: "token",
      onRehydrateStorage: () => async (state) => {
        if (!state) return;

        state.valid = false;
        state.validate(state.token);
      },
    },
  ),
);
