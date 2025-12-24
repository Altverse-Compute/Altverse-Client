import { create } from "zustand";
import { useResize } from "./resize";
import { mouseEvents } from "../game/events/mouse";

interface MouseState {
  enable: boolean;
}

export const useMouseStore = create<MouseState>(() => ({
  enable: false,
}));

export const mouseEvent = (event: MouseEvent) => {
  if (event.type === "mousemove") {
    const resize = useResize.getState();
    if (useMouseStore.getState().enable)
      mouseEvents.emit("move", {
        x:
          (event.pageX - resize.canvasLeft) / resize.scale -
          resize.canvasWidth / 2,
        y:
          (event.pageY - resize.canvasTop) / resize.scale -
          resize.canvasHeight / 2,
      });
  }
  if (event.type === "mousedown") {
    if (event.buttons === 1) {
      mouseEvents.emit("enable", !useMouseStore.getState().enable);
      useMouseStore.setState({ enable: !useMouseStore.getState().enable });
    }
  }
};
