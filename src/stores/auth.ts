import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResponseMessage, type LoginProps, type Profile, type RegisterProps } from "../api/types";
import { ApiRequests } from "../api/requests";

export interface AuthState {
  valid: boolean;
  profile?: Profile;

  validate: () => void;
  login: (obj: LoginProps) => Promise<string>;
  register: (obj: RegisterProps) => Promise<string>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      token: "",
      valid: false,
      validate: async () => {
        const response = await ApiRequests.check();
        console.log(response)

        if (response.status === ResponseMessage.Ok) set({ valid: true, profile: response.profile});
      },
      register: async (obj) => {
        const response = await ApiRequests.register(obj);

        if (response.status === ResponseMessage.Ok)  {
          set({
            valid: true,
            profile: response.profile,
          });
          return "";
        }
        return response.status;
      },
      login: async (obj) => {
        const response = await ApiRequests.login(obj);

        if (response.status === ResponseMessage.Ok) {
          set({
            profile: response.profile,
            valid: true,
          });
          return "";
        }
        return response.status;
      },
      logout: async () => {
        // ApiRequests.logout(get().token);
        // set({ token: "", valid: false });
        // console.log("logout");
      },
    }),
    {
      name: "token",
      onRehydrateStorage: () => async (state) => {
        if (!state) return;

        state.valid = false;
        state.validate();
      },
    },
  ),
);
