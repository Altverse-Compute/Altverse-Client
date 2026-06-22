import { create } from "zustand";
import { ApiRequests } from "../api/requests";
import * as http from "@proto/http_pb";

interface State {
  servers: http.AdminModeServersResponse | undefined;
  fetchServers: () => Promise<void>;
}

export const useAdminModeStore = create<State>((set) => ({
  servers: undefined,
  fetchServers: async () => {
    const response = await ApiRequests.adminServers();

    if (response.status === http.ResponseStatus.Ok) {
      set({ servers: response });
    }
  },
}));
