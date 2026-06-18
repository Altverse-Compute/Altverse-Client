import {create} from "zustand";
import {persist} from "zustand/middleware";
import {type LoginProps, type RegisterProps} from "../api/types";
import {ApiRequests} from "../api/requests";
import Cookies from "js-cookie"
import { http } from "../proto/generated/js";

export interface AuthState {
  valid: boolean | undefined;
  profile?: http.IProfile;

  validate: () => void;
  login: (obj: LoginProps) => Promise<http.ResponseStatus>;
  register: (obj: RegisterProps) => Promise<http.ResponseStatus>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      valid: undefined,
      validate: async () => {
        const response = await ApiRequests.check();
        if (response.status === http.ResponseStatus.Ok) set({ valid: true, profile: response.profile!});
      },
      register: async (obj) => {
        const response = await ApiRequests.register(obj);

        if (response.status === http.ResponseStatus.Ok)  {
          set({
            valid: true,
            profile: response.profile!,
          });
          return "";
        }
        return response.status!;
      },
      login: async (obj) => {
        const response = await ApiRequests.login(obj);

        if (response.status === http.ResponseStatus.Ok) {
          set({
            profile: response.profile!,
            valid: true,
          });
          return "";
        }
        return response.status!;
      },
      logout: async () => {
        ApiRequests.logout(Cookies.get("token")!);
        Cookies.remove("token")
        set({ valid: false });
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
