import { useEffect, useRef, useState } from "preact/hooks";
import type * as http from "@proto/http_pb.ts";
import { Badge } from "../../components/basic/Badge";
import { Card } from "../../components/basic/Card";
import { AdminEditServerModal } from "../../components/admin/EditModal";
import { AdminAddServerModal } from "../../components/admin/AddModal";
import { ApiRequests } from "../../api/requests";
import { useAuthStore } from "../../stores/auth";
import { AdminTokenModal } from "./TokenModal";
import { useAdminModeStore } from "../../stores/admin";

export const AdminServerList = () => {
  const modalEditServerRef = useRef<HTMLDialogElement | null>(null);
  const modalCreateServerRef = useRef<HTMLDialogElement | null>(null);
  const [selectedServer, setSelectedServer] = useState<http.AdminModeServer>();
  const { servers } = useAdminModeStore();
  const auth = useAuthStore();

  const selectServer = (index: number) => {
    setSelectedServer(servers?.servers![index]);
  };

  return (
    <>
      <div className={"w-full flex justify-between"}>
        <Badge text={`Servers Online: ${servers?.online}/${servers?.count}`} />
        <button
          className={"btn btn-lg btn-success"}
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
            <div className={"flex flex-row justify-between"}>
              <div>
                <div className={"flex items-center"}>
                  <h1 className={"text-3xl w-10"}>{server.icon}</h1>
                  <div>
                    <h1 className={"text-2xl"}>{server.name}</h1>
                  </div>
                </div>
                <p className={"text-md"}>{server.domain}</p>
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
    </>
  );
};
