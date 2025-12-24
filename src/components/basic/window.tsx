import type { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
  className: string;
}

export function Window(props: Props) {
  return (
    <div
      className={
        "pl-1 pr-1 pt-0.5 pb-0.5 border-2 bg-(--window-bg) text-2xl rounded-xl " + props.className
      }
    >
      {props.children}
    </div>
  );
}
