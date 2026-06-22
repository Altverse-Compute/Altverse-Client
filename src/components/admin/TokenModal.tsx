import type { RefObject } from "preact";

interface Props {
  token: string;
  modalRef: RefObject<HTMLDialogElement>;
}

export const AdminTokenModal = ({ token, modalRef }: Props) => {
  return (
    <dialog className="modal" ref={modalRef}>
      <div className="modal-box gap-2 flex flex-col w-150">
        <h1 className={"text-2xl text-center"}>Editing Server</h1>
        <label class="label flex p-1">
          <span class="label-text">Server Token</span>
          <p class="p-1 overflow-scroll w-full border-primary border-2 rounded-md">
            {token}
          </p>
        </label>
        <div className={"flex gap-2 flex-row justify-center w-full"}>
          <button
            className={"btn btn-lg btn-primary"}
            onClick={() => {
              navigator.clipboard.writeText(token);
            }}
          >
            Copy
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
  );
};
