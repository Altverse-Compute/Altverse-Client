import mitt from "mitt";

type Events = {
  move: { x: number; y: number };
  enable: boolean;
};

export const mouseEvents = mitt<Events>();
