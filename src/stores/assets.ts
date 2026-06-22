import { create } from "zustand";
import { ApiRequests } from "../api/requests";
import type { http } from "../proto/generated/js";

interface State {
  worlds: Record<string, http.IWorldResponse>;
  loaded: boolean;
  fetch: (serverUrl: string) => void;
}

export const useAssetsStore = create<State>((set) => ({
  worlds: {},
  loaded: false,
  fetch(serverUrl) {
    ApiRequests.worlds(serverUrl).then((worlds) => {
      set({ worlds: worlds.worlds, loaded: true });
    });
  },
}));
