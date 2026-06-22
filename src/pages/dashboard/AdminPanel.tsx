import { useEffect } from "preact/hooks";
import { useAuthStore } from "../../stores/auth";
import { navigate } from "wouter/use-browser-location";
import * as http from "@proto/http_pb";
import { AdminServerList } from "../../components/admin/ServerList";
import { useAdminModeStore } from "../../stores/admin";

export const AdminPanel = () => {
  const auth = useAuthStore();
  const adminMode = useAdminModeStore();

  useEffect(() => {
    if (auth.loaded)
      if (auth.valid && auth.profile!.role !== http.AccountRole.ADMIN)
        navigate("/dashboard");
      else adminMode.fetchServers();
  }, [auth.loaded, auth.valid]);

  return (
    <div className={"md:w-[700px] w-full text-xl flex flex-col gap-2 pt-4"}>
      <h1 className={"text-center text-2xl"}>Admin Panel</h1>
      <h1 className={"divider text-2xl"}>Server Management</h1>
      <AdminServerList />
    </div>
  );
};
