import { useEffect, useRef, useState } from "preact/hooks";
import * as http from "@proto/http_pb";
import type { RefObject } from "preact";
import { ApiRequests } from "../../api/requests";
import { AdminTokenModal } from "./TokenModal";
import { useNotificationsStore } from "../../stores/notification";
import { useAdminModeStore } from "../../stores/admin";
import { create } from "@bufbuild/protobuf";

interface Props {
  modalRef: RefObject<HTMLDialogElement>;
}

export const AdminAddServerModal = ({ modalRef }: Props) => {
  const tokenModalRef = useRef<HTMLDialogElement>(null);
  const notifications = useNotificationsStore();
  const { fetchServers } = useAdminModeStore();

  const nameInput = useRef<HTMLInputElement>(null);
  const domainInput = useRef<HTMLInputElement>(null);
  const iconInput = useRef<HTMLInputElement>(null);
  const [token, setToken] = useState<string>("");

  return (
    <>
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box gap-2 grid grid-col">
          <h1 className={"text-2xl text-center"}>Adding Server</h1>
          <div className={"flex flex-col gap-2"}>
            <label class="label">
              <span class="label-text w-40">Server Name</span>
              <input
                class="input w-full text-lg"
                type="text"
                placeholder="Imagine the server name"
                maxLength={16}
                ref={nameInput}
              />
            </label>
            <label class="label">
              <span class="label-text w-40">Server Url</span>
              <input
                class="input w-full text-lg"
                type="text"
                placeholder="Your url here"
                maxLength={32}
                ref={domainInput}
              />
            </label>
            <label class="label">
              <span class="label-text w-40">Server Icon</span>
              <input
                class="input w-full text-lg"
                type="text"
                placeholder="And finish!"
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
                const result = await ApiRequests.adminServerAdd(
                  create(http.AdminModeAddServerRequestSchema, {
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
              Add
            </button>
            <button
              className={"btn btn-lg btn-neutral"}
              onClick={() => {
                modalRef.current?.close();
              }}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
      <AdminTokenModal token={token} modalRef={tokenModalRef} />
    </>
  );
};
