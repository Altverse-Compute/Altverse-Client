import type { ClientWorld } from "shared";
import { create } from "zustand";
import { ApiRequests } from "../api/requests";

interface State {
  worlds: Record<string, ClientWorld>;
  loaded: boolean;
  fetch: () => void;
}

export const useAssetsStore = create<State>((set) => ({
  worlds: {},
  loaded: false,
  fetch() {
    ApiRequests.worlds().then((worlds) => {
      set({ worlds, loaded: true });
      console.log(worlds);
    });
  },
}));
