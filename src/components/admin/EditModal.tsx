import { useEffect, useRef, useState } from "preact/hooks";
import type { http } from "../../proto/generated/js";
import type { RefObject } from "preact";
import { useNotificationsStore } from "../../stores/notification";

interface Props {
  selectedServer: http.IAdminModeServer | null | undefined;
  modalRef: RefObject<HTMLDialogElement>;
}

export const AdminEditServerModal = ({ selectedServer, modalRef }: Props) => {
  const name = useRef<string>("");
  const domain = useRef<string>("");
  const icon = useRef<string>("");
  const notifications = useNotificationsStore();

  useEffect(() => {
    if (selectedServer != undefined && selectedServer !== null) {
      name.current = selectedServer.name! + "";
      domain.current = selectedServer.domain! + "";
      icon.current = selectedServer.icon! + "";
      console.log(domain.current);
    }
  }, [selectedServer]);

  return (
    <dialog className="modal" ref={modalRef}>
      <div className="modal-box gap-2 grid grid-col">
        <h1 className={"text-2xl text-center"}>Editing Server</h1>
        <div className={"flex flex-col gap-2"}>
          <label class="label">
            <span class="label-text w-40">Server Name</span>
            <input
              class="input w-full text-lg"
              type="text"
              placeholder="Great Server"
              value={name.current}
              onInput={(element) => {
                name.current = element.data!;
              }}
            />
          </label>
          <label class="label">
            <span class="label-text w-40">Server Url</span>
            <input
              class="input w-full text-lg"
              type="text"
              placeholder="localhost:7002"
              value={domain.current}
              onInput={(element) => {
                domain.current = element.data!;
              }}
            />
          </label>
          <label class="label">
            <span class="label-text w-40">Server Icon</span>
            <input
              class="input w-full text-lg"
              type="text"
              placeholder="X"
              value={icon.current}
              onInput={(element) => {
                icon.current = element.data!;
              }}
            />
          </label>
          <label class="label justify-between">
            <span class="label-text w-28">Token</span>
            <button className={"btn btn-lg btn-neutral"} onClick={() => {
              notifications.addNotification({
                message: "Server successfully edited",
                title: "Server Edit",
                type: "success",
              });
            }}>
              Reset
            </button>
          </label>
        </div>
        <div className={"flex w-full gap-2 justify-between"}>
          <button className={"btn btn-lg btn-primary"}>Save</button>
          <button
            className={"btn btn-lg btn-neutral"}
            onClick={() => {
              modalRef.current?.close();
              notifications.addNotification({
                message: "Server successfully edited",
                title: "Server Edit",
                type: "success",
              });
            }}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};
