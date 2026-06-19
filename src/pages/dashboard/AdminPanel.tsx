import { useEffect, useRef, useState } from "preact/hooks";
import { useAuthStore } from "../../stores/auth";
import { navigate } from "wouter/use-browser-location";
import { http } from "../../proto/generated/js";
import { Badge } from "../../components/basic/Badge";
import { Card } from "../../components/basic/Card";
import { AdminEditServerModal } from "../../components/admin/EditModal";
import { AdminAddServerModal } from "../../components/admin/AddModal";

export const AdminPanel = () => {
  const auth = useAuthStore();
  const modalEditServerRef = useRef<HTMLDialogElement | null>(null);
  const modalCreateServerRef = useRef<HTMLDialogElement | null>(null);
  const [selectedServer, setSelectedServer] = useState<http.IAdminModeServer>();

  useEffect(() => {
    if (auth.valid && auth.profile!.role !== http.AccountRole.ADMIN)
      navigate("/dashboard");
  }, [auth.valid]);

  const [servers, setServers] = useState<http.IAdminModeServersResponse>();

  useEffect(() => {
    const fetchServers = async () => {
      const servers: http.IAdminModeServersResponse = {
        online: 1,
        count: 1,
        servers: [
          {
            domain: "localhost:7002",
            icon: "X",
            name: "EtherCD's lab",
            lastSeen: "19.06.26",
          },
        ],
      };
      setServers(servers);
    };
    fetchServers();
  }, []);

  const selectServer = (index: number) => {
    setSelectedServer(servers?.servers![index]);
  };

  return (
    <div className={"md:w-[700px] w-full text-xl flex flex-col gap-2 pt-4"}>
      <h1 className={"text-center text-2xl"}>Admin Panel</h1>
      <h1 className={"divider text-2xl"}>Server Management</h1>
      <div className={"w-full flex justify-between"}>
        <Badge text={"Servers Online: 0/1"} />
        <button
          className={"btn btn-lg btn-primary"}
          onClick={() => {
            modalCreateServerRef.current?.showModal();
          }}
        >
          Add Server
        </button>
      </div>
      <div className={"grid md:grid-cols-2 gap-5 "}>
        {servers?.servers!.map((server, index) => (
          <Card size={"sm"}>
            <div className={"flex flex-col"}>
              <div className={"flex items-center"}>
                <h1 className={"text-3xl w-10"}>{server.icon}</h1>
                <div>
                  <h1 className={"text-2xl"}>{server.name}</h1>
                  <p className={"text-lg"}>Last active {"19.06.25"}</p>
                </div>
              </div>
              <button
                className={"btn btn-lg btn-primary"}
                onClick={() => {
                  selectServer(index);
                  modalEditServerRef.current?.showModal();
                }}
              >
                Edit
              </button>
            </div>
          </Card>
        ))}
      </div>
      <AdminEditServerModal
        selectedServer={selectedServer}
        modalRef={modalEditServerRef}
      />
      <AdminAddServerModal modalRef={modalCreateServerRef} />
    </div>
  );
};
