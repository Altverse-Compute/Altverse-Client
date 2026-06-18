import { useMemo, useRef, useState } from "preact/hooks";

export const GameChangelog = () => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const [choosed, setChoosed] = useState<number>(0);

  const changelog = [
    {
      title: "Small Update",
      features: ["optimised working with"],
      date: "08.01.26",
    },
  ];

  const change = useMemo(() => {
    return changelog[choosed];
  }, [choosed]);

  return (
    <div className={"w-full"}>
      <h1 className={"divider text-2xl"}>Changelog</h1>
      <div className={"grid grid-cols-3 gap-4"}>
        {changelog.map((v, i) => (
          <div
            className={
              "card bg-base-100 min-h-60 p-5 flex flex-col  max-h-50 relative"
            }
          >
            <h1 className={"text-xl text-center"}>{v.title}</h1>
            <h2 className={"text-xl text-center"}>{v.date}</h2>
            <div className={"from-base-100 to-base-300 h-60 absolute"}></div>
            <ul className={"flex-1 overflow-hidden list-decimal"}>
              {v.features.map((feature) => (
                <li>{feature}</li>
              ))}
            </ul>
            <button
              className={"btn"}
              onClick={() => {
                modalRef.current?.showModal();
                setChoosed(i);
              }}
            >
              See full
            </button>
          </div>
        ))}
      </div>
      <dialog className="modal" ref={modalRef}>
        <div className="modal-box">
          <h1 className={"text-xl text-center"}>{change.title}</h1>
          <h2 className={"text-xl text-center"}>{change.date}</h2>
          <ul className={"flex-1 overflow-hidden list-disc"}>
            {change.features.map((feature) => (
              <li>{feature}</li>
            ))}
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
