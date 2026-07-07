import { create } from "zustand";
import { ApiRequests } from "../api/requests";
import type { WorldResponse } from "@proto/http_pb";

interface State {
  worlds: Record<string, WorldResponse>;
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
