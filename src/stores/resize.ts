import { create } from "zustand";

interface ResizeState {
  scale: number;
  canvasLeft: number;
  canvasTop: number;
  canvasWidth: number;
  canvasHeight: number;

  resize: (scale: number, canvas: HTMLCanvasElement, rect: DOMRect) => void;
}

export const useResize = create<ResizeState>((set, _) => ({
  scale: 1,
  canvasLeft: 0,
  canvasTop: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  resize(scale, canvas, rect) {
    set({
      scale,
      canvasLeft: rect.left,
      canvasTop: rect.top,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height,
    });
  },
}));
