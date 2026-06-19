import { useEffect, useRef, useState } from "preact/hooks";
import type { http } from "../../proto/generated/js";
import type { RefObject } from "preact";

interface Props {
  modalRef: RefObject<HTMLDialogElement>;
}

export const AdminAddServerModal = ({ modalRef }: Props) => {
  const name = useRef<string>("");
  const domain = useRef<string>("");
  const icon = useRef<string>("");
  const token = useRef<string>("");

  return (
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
              placeholder="Your url here"
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
              placeholder="And finish!"
              value={icon.current}
              onInput={(element) => {
                icon.current = element.data!;
              }}
            />
          </label>
          <label class="label ">
            <span class="label-text w-28">Token</span>
            {token.current.length == 0 ? (
              <button className={"btn btn-lg btn-neutral"} onClick={() => {}}>
                Generate
              </button>
            ) : (
              <input
                class="input w-full text-lg"
                type="text"
                placeholder="Input"
                disabled
                value={icon.current}
                onInput={(element) => {
                  icon.current = element.data!;
                }}
              />
            )}
          </label>
        </div>
        <div className={"flex w-full gap-2 justify-between"}>
          <button className={"btn btn-lg btn-primary"}>Add</button>
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
  );
};
