import type { ComponentChildren } from "preact";

interface Props {
  children: ComponentChildren;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

export const SideBarButton = (props: Props) => {
  return (
    <button
      onClick={props.onClick}
      className={
        props.className +
        " " +
        (props.selected ? "outline-2" : "outline-1") +
        " mb-0.5 bg-(--elements-bg) w-[200px] h-[50px] outline-[#9FB8D2] rounded-[10px] hover:translate-x-0.5 transition-transform"
      }
    >
      {props.children}
    </button>
  );
};
