import { useEffect } from "preact/hooks";
import { useAuthStore } from "../../stores/auth";
import { navigate } from "wouter/use-browser-location";
import { http } from "../../proto/generated/js";
import { AdminServerList } from "../../components/admin/ServerList";

export const AdminPanel = () => {
  const auth = useAuthStore();

  useEffect(() => {
    if (auth.loaded)
      if (auth.valid && auth.profile!.role !== http.AccountRole.ADMIN)
        navigate("/dashboard");
  }, [auth.loaded, auth.valid]);

  return (
    <div className={"md:w-[700px] w-full text-xl flex flex-col gap-2 pt-4"}>
      <h1 className={"text-center text-2xl"}>Admin Panel</h1>
      <h1 className={"divider text-2xl"}>Server Management</h1>
      <AdminServerList />
    </div>
  );
};
