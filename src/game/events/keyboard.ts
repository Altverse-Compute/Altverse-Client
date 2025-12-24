import mitt from "mitt";

export type Keys =
  | "up"
  | "down"
  | "right"
  | "shift"
  | "left"
  | "upgrade_speed"
  | "upgrade_energy"
  | "upgrade_regen"
  | "upgrade_firstAb"
  | "upgrade_secondAb"
  | "first"
  | "second";

export type Events = {
  down: Keys;
  up: Keys;
  enter: boolean;
};

export const keyboardEvents = mitt<Events>();
