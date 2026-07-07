import { useEffect, useRef, useState } from "preact/hooks";
import * as http from "@proto/http_pb";
import type { RefObject } from "preact";
import { useNotificationsStore } from "../../stores/notification";
import { AdminTokenModal } from "./TokenModal";
import { ApiRequests } from "../../api/requests";
import { useAdminModeStore } from "../../stores/admin";
import { create } from "@bufbuild/protobuf";

interface Props {
  selectedServer: http.AdminModeServer | null | undefined;
  modalRef: RefObject<HTMLDialogElement>;
}

export const AdminEditServerModal = ({ selectedServer, modalRef }: Props) => {
  const nameInput = useRef<HTMLInputElement>(null);
  const domainInput = useRef<HTMLInputElement>(null);
  const iconInput = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState<string>("");
  const notifications = useNotificationsStore();
  const tokenModalRef = useRef<HTMLDialogElement>(null);

  const { fetchServers } = useAdminModeStore();

  const modalCloseEvent = (event: Event) => {
    if (
      selectedServer != undefined &&
      selectedServer !== null &&
      nameInput.current &&
      domainInput.current &&
      iconInput.current
    ) {
      nameInput.current!.value = selectedServer.name! + "";
      domainInput.current!.value = selectedServer.domain! + "";
      iconInput.current!.value = selectedServer.icon! + "";
      setToken("");
    }
  };

  useEffect(() => {
    if (
      selectedServer != undefined &&
      selectedServer !== null &&
      nameInput.current &&
      domainInput.current &&
      iconInput.current
    ) {
      modalRef.current!.removeEventListener("close", modalCloseEvent);
      nameInput.current!.value = selectedServer.name! + "";
      domainInput.current!.value = selectedServer.domain! + "";
      iconInput.current!.value = selectedServer.icon! + "";
      setToken("");
      modalRef.current!.addEventListener("close", modalCloseEvent);
    }
  }, [selectedServer]);

  return (
    <>
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box gap-2 grid grid-col">
          <h1 className={"text-2xl text-center"}>Editing Server</h1>
          <div className={"flex flex-col gap-2"}>
            <label class="label">
              <span class="label-text w-40">Server Name</span>
              <input
                class="input w-full text-lg text-primary"
                type="text"
                placeholder="Great Server"
                maxLength={16}
                ref={nameInput}
              />
            </label>
            <label class="label">
              <span class="label-text w-40 ">Server Url</span>
              <input
                class="input w-full text-lg text-primary"
                type="text"
                placeholder="localhost:7002"
                maxLength={32}
                ref={domainInput}
              />
            </label>
            <label class="label">
              <span class="label-text w-40">Server Icon</span>
              <input
                class="input w-full text-lg  text-primary"
                type="text"
                placeholder="X"
                maxLength={10}
                ref={iconInput}
              />
            </label>
            <label class="label justify-between">
              <span class="label-text w-28">Token</span>
              <button
                className={"btn btn-lg btn-secondary"}
                onClick={async () => {
                  const resp = await ApiRequests.adminServerToken();
                  if (resp.status === http.ResponseStatus.Ok) {
                    setToken(resp.token);
                    tokenModalRef.current?.showModal();
                  }
                }}
              >
                Generate
              </button>
            </label>
          </div>
          <div className={"flex w-full gap-2 justify-between"}>
            <button
              className={"btn btn-lg btn-primary"}
              onClick={async () => {
                const result = await ApiRequests.adminServerEdit(
                  create(http.AdminModeEditServerRequestSchema, {
                    id: selectedServer?.id ?? "",
                    domain: domainInput.current?.value ?? "",
                    icon: iconInput.current?.value ?? "",
                    name: nameInput.current?.value ?? "",
                    token: token.length === 0 ? undefined : token,
                  }),
                );
                if (result.status === http.ResponseStatus.Ok) {
                  notifications.addNotification({
                    message: "Server successfully edited",
                    title: "Server Edit",
                    type: "success",
                  });
                  fetchServers();
                }
                modalRef.current?.close();
              }}
            >
              Update
            </button>
            <div className={"gap-2 flex"}>
              <button
                className={"btn btn-lg btn-error"}
                onClick={async () => {
                  const result = await ApiRequests.adminServerRem(
                    create(http.AdminModeRemServerRequestSchema, {
                      id: selectedServer?.id ?? "",
                    }),
                  );
                  if (result.status === http.ResponseStatus.Ok) {
                    notifications.addNotification({
                      message: "Server successfully edited",
                      title: "Server Edit",
                      type: "success",
                    });
                    fetchServers();
                  }
                  modalRef.current?.close();
                }}
              >
                Delete
              </button>
              <button
                className={"btn btn-lg btn-error"}
                onClick={() => {
                  modalRef.current?.close();
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </dialog>
      <AdminTokenModal token={token} modalRef={tokenModalRef} />
    </>
  );
};
