import { create } from "zustand";
import { keyboardEvents, type Keys } from "../game/events/keyboard";

export const keyCodes: Record<string, Keys> = {
  KeyW: "up",
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
  Digit1: "upgrade_speed",
  Digit2: "upgrade_energy",
  Digit3: "upgrade_regen",
  Digit4: "upgrade_firstAb",
  Digit5: "upgrade_secondAb",
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  ShiftLeft: "shift",
  ShiftRight: "shift",
  KeyZ: "first",
  KeyX: "second",
};

interface KeyboardState {
  isChatting: boolean;
  left: boolean;
  up: boolean;
  right: boolean;
  down: boolean;
  shift: boolean;
  setChatting: (value: boolean) => void;
  clearMovement: () => void;
}

export const useKeyboard = create<KeyboardState>((set, _) => ({
  isChatting: false,
  left: false,
  up: false,
  right: false,
  down: false,
  shift: false,
  setChatting(value) {
    set({ isChatting: value });
  },
  clearMovement() {
    set({
      left: false,
      up: false,
      right: false,
      down: false,
      shift: false,
    });
  },
}));

export const keyboardEvent = (event: KeyboardEvent) => {
  const state = useKeyboard.getState();
  if (keyCodes[event.code] && !state.isChatting) {
    keyboardEvents.emit(
      event.type === "keydown" ? "down" : "up",
      keyCodes[event.code]
    );
    useKeyboard.setState({
      [keyCodes[event.code]]: event.type === "keydown",
    });
  }
  if (event.code === "Enter" && event.type === "keydown") {
    const isChatting = state.isChatting;
    if (isChatting) state.clearMovement();
    keyboardEvents.emit("enter", isChatting);
  }
};
