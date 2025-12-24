import { type MutableRef, useEffect, useRef } from "preact/hooks";
import { useResize } from "../stores/resize";
import { keyboardEvent } from "../stores/keyboard";
import { mouseEvent } from "../stores/mouse";
import { Render } from "../game/render";
import { useGameStore } from "../stores/game";
import { webSocketConnection } from "../game/connection";
import { useAssetsStore } from "../stores/assets.ts";

export function useGame(): [
  MutableRef<HTMLCanvasElement | null>,
  string | undefined
] {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D>();
  const { reason } = useGameStore();

  useEffect(() => {
    if (canvasRef.current) {
      resize();
      contextRef.current = canvasRef.current.getContext("2d") ?? undefined;
      render();
    }
  }, [canvasRef.current]);

  const resize = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      let s = window.innerWidth / canvas.width;
      if (
        window.innerHeight / canvas.height <
        window.innerWidth / canvas.width
      ) {
        s = window.innerHeight / canvas.height;
      }
      canvas.style.transform = `scale(${s})`;
      canvas.style.left = (1 / 2) * (window.innerWidth - canvas.width) + "px";
      canvas.style.top = (1 / 2) * (window.innerHeight - canvas.height) + "px";
      const canvasRect = canvas.getBoundingClientRect();

      useResize.getState().resize(s, canvas, canvasRect);
    }
  };
  const render = () => {
    requestAnimationFrame(render);
    if (!useGameStore.getState().isGameInit) return;
    Render.render(canvasRef.current!, contextRef.current!);
  };

  useEffect(() => {
    window.onresize = resize;

    window.addEventListener("keydown", keyboardEvent);
    window.addEventListener("keyup", keyboardEvent);
    canvasRef.current!.addEventListener("mousedown", mouseEvent);
    canvasRef.current!.addEventListener("mouseup", mouseEvent);
    canvasRef.current!.addEventListener("mousemove", mouseEvent);

    webSocketConnection.connect();
    webSocketConnection.link();
    useAssetsStore.getState().fetch();

    return () => {
      window.removeEventListener("keydown", keyboardEvent);
      window.removeEventListener("keyup", keyboardEvent);
      canvasRef.current!.removeEventListener("mousedown", mouseEvent);
      canvasRef.current!.removeEventListener("mouseup", mouseEvent);
      canvasRef.current!.removeEventListener("mousemove", mouseEvent);
    };
  }, []);

  return [canvasRef, reason];
}
