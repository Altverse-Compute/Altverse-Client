import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type LoginProps, type RegisterProps } from "../api/types";
import { ApiRequests } from "../api/requests";
import Cookies from "js-cookie";
import * as http from "@proto/http_pb";
import { errorsAndStatusAlias } from "../types";

export interface AuthState {
  valid: boolean | undefined;
  profile?: http.Profile;
  loaded: boolean;

  validate: () => void;
  login: (obj: LoginProps) => Promise<string>;
  register: (obj: RegisterProps) => Promise<string>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      valid: undefined,
      loaded: false,
      validate: async () => {
        const response = await ApiRequests.check();
        if (response.status === http.ResponseStatus.Ok)
          set({ valid: true, profile: response.profile! });
        set({ loaded: true });
      },
      register: async (obj) => {
        const response = await ApiRequests.register(obj);

        if (response.status === http.ResponseStatus.Ok) {
          set({
            valid: true,
            profile: response.profile!,
          });
          return "";
        } else return errorsAndStatusAlias[response.status!];
      },
      login: async (obj) => {
        const response = await ApiRequests.login(obj);

        if (response.status === http.ResponseStatus.Ok) {
          if (response.profile) {
            set({
              profile: response.profile!,
            });
          }
          set({
            valid: true,
          });
          return "";
        }
        return errorsAndStatusAlias[response.status!];
      },
      logout: async () => {
        ApiRequests.logout();
        Cookies.remove("token");
        set({ valid: false });
      },
    }),
    {
      name: "token",
      onRehydrateStorage: () => async (state) => {
        if (!state) return;
        state.loaded = false;
        state.validate();
      },
    },
  ),
);
