import mitt from "mitt";
import * as game from "@proto/game_pb";

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

export const localToProto: Record<Keys, game.ClientKey> = {
  up: game.ClientKey.UP,
  down: game.ClientKey.DOWN,
  right: game.ClientKey.RIGHT,
  shift: game.ClientKey.SHIFT,
  left: game.ClientKey.LEFT,
  upgrade_speed: game.ClientKey.UP,
  upgrade_energy: game.ClientKey.UP,
  upgrade_regen: game.ClientKey.UP,
  upgrade_firstAb: game.ClientKey.UP,
  upgrade_secondAb: game.ClientKey.UP,
  first: game.ClientKey.UP,
  second: game.ClientKey.UP,
};

export const keyboardEvents = mitt<Events>();
