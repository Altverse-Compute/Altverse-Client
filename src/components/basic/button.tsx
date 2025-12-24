import type { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
  onClick: (event: Event) => void;
  className?: string;
}

export function Button(props: Props) {
  return (
    <button
      className={
        props.className +
        " p-0.5 pb-0.5 outline-2 bg-(--elements-bg)  text-2xl rounded-xl hover:translate-y-[-5px] transition-all"
      }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}
