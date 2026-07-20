import { create } from "zustand";
import Entity from "../game/units/entity";
import { Player } from "../game/units/player";
import Zone from "../game/units/zone";
import { Spawn } from "../game/spawner";
import { useKeyboard } from "./keyboard";
import { useMouseStore } from "./mouse";
import type {
  IChat,
  ICloseEntities,
  IClosePlayer,
  IEntities,
  IPackedArea,
  IPackedPlayer,
  IPlayers,
  IUpdateEntities,
  IUpdatePlayers,
  PackedPlayer,
} from "../game/pulse";

export interface GameState {
  areaBoundary: { w: number; h: number };
  players: Record<number, Player>;
  zones: Array<Zone>;
  entities: Record<number, Entity>;
  world: string;
  area: number;
}

export let gameState: GameState = {
  areaBoundary: { w: 0, h: 0 },
  zones: [],
  entities: {},
  players: {},
  world: "",
  area: 0,
};

export interface ShortPlayer {
  name: string;
  area: number;
  hero: string;
  world: string;
  died?: boolean;
  dt?: number;
}

export type Chat = {
  author: string;
  content: string;
  id: number;
  world: string;
};

interface State {
  selfId: number;
  players: Record<string, ShortPlayer>;
  messages: Array<Chat>;
  isGameInit: boolean;
  reason?: string;

  message(data: IChat): void;
  uplayers(data: IPlayers): void;
  self(data: IPackedPlayer): void;
  areaInit(data: IPackedArea): void;
  newPlayer(data: IPackedPlayer): void;
  closePlayer(data: IClosePlayer): void;
  updatePlayers(data: IUpdatePlayers): void;
  newEntities(data: IEntities): void;
  updateEntities(data: IUpdateEntities): void;
  closeEntities(data: ICloseEntities): void;
  close(reason: string): void;
  clear(): void;
}

export const useGameStore = create<State>((set, get) => ({
  selfId: -1,
  players: {},
  messages: [],
  isGameInit: false,
  message(data) {
    const old = get();
    set({
      messages: [
        ...old.messages,
        {
          author: data.author,
          content: data.content,
          id: Number(data.id),
          world: data.world,
        },
      ],
    });
  },
  uplayers(data) {
    for (const player of data.players) {
      gameState.players[Number(player.id)] = Spawn.player(player);
      const players = get().players;
      set({
        players: {
          ...players,
          [Number(player.id)]: {
            name: player.name,
            area: Number(player.area),
            hero: player.hero,
            world: player.world,
          },
        },
      });
    }
  },
  self(data) {
    set({ selfId: Number(data.id)!, isGameInit: true });
    gameState.players[Number(data.id!)] = Spawn.player(data);
  },
  areaInit(data) {
    gameState.entities = {};
    for (const entity of data.entities) {
      gameState.entities[Number(entity.id)] = Spawn.entity(entity);
    }
    // let clientData: ClientArea | undefined;
    // const areas = useAssetsStore.getState().worlds[data.world].areas;
    // if (Object.keys(areas).includes(data.area + ""))
    //   clientData = areas[data.area];

    // if (clientData && clientData.win)
    const w = data.w;
    const h = data.h;
    const world = data.world;
    const area = data.area;
    gameState.zones = [
      new Zone({
        x: -10 * 32,
        y: 0,
        w: 2 * 32,
        h: h,
        type: "teleport",
      }),
      new Zone({
        x: -8 * 32,
        y: 0,
        w: w + 16 * 32,
        h: h,
        type: "victory",
      }),
      new Zone({
        x: w + 8 * 32,
        y: 0,
        w: 2 * 32,
        h: h!,
        type: "exit",
      }),
    ];
    // else
    gameState.zones = [
      ...(area === 0
        ? [
            new Zone({
              x: -10 * 32,
              y: 0,
              w: 10 * 32,
              h: 2 * 32,
              type: "teleport_world",
            }),
            new Zone({
              x: -10 * 32,
              y: 2 * 32,
              w: 10 * 32,
              h: h! - 2 * 32,
              type: "safe",
            }),
            new Zone({
              x: -10 * 32,
              y: h! - 2 * 32,
              w: 10 * 32,
              h: 2 * 32,
              type: "teleport_world",
            }),
          ]
        : [
            new Zone({
              x: -10 * 32,
              y: 0,
              w: 2 * 32,
              h: h!,
              type: "teleport",
            }),
            new Zone({
              x: -8 * 32,
              y: 0,
              w: 8 * 32,
              h: h!,
              type: "safe",
            }),
          ]),
      new Zone({
        x: 0,
        y: 0,
        w: w!,
        h: h!,
        type: "active",
      }),
      new Zone({
        x: w!,
        y: 0,
        w: 8 * 32,
        h: h!,
        type: "safe",
      }),
      new Zone({
        x: w! + 8 * 32,
        y: 0,
        w: 2 * 32,
        h: h!,
        type: "teleport",
      }),
    ];

    gameState.world = world!;
    gameState.area = area!;
    gameState.areaBoundary = {
      w,
      h,
    };
  },
  newPlayer(data) {
    const id = Number(data.id);
    gameState.players[id] = Spawn.player(data);
    const players = get().players;
    set({
      players: {
        ...players,
        [id]: {
          area: Number(data.area),
          world: data.world,
          hero: data.hero,
          name: data.name,
        },
      },
    });
  },
  closePlayer(data) {
    if (Object.keys(gameState.players).includes(Number(data) + "")) {
      delete gameState.players[Number(data)];
      let players = get().players;
      let out: Record<number, ShortPlayer> = {};
      for (const i in players) {
        if (Number(i) !== Number(data)) out[Number(i)] = players[i];
      }
      set({
        players: out,
      });
    }
  },
  updatePlayers(data) {
    for (const player of data.items) {
      const id = Number(player.id);
      gameState.players[id].accept(player);
      const state = get().players;
      const deathTimer = player.death_timer;
      const died = player.downed;
      const world = player.world;
      const area = Number(player.area);
      if (
        (deathTimer !== null && state[id].dt !== deathTimer) ||
        (died !== undefined && state[id].died !== died) ||
        (world !== undefined && state[id].world !== world) ||
        (area !== undefined && state[id].area !== Number(area))
      ) {
        set({
          players: {
            ...state,
            [id]: {
              ...state[id],
              world: world ?? state[id].world,
              area: area ?? state[id].area,
              dt:
                deathTimer !== undefined
                  ? Math.floor(deathTimer!)
                  : state[id].dt,
              died: died != undefined ? died : state[id].died,
            },
          },
        });
      }
    }
  },
  newEntities(data) {
    for (const entity of data.entities) {
      const id = Number(entity.id);
      gameState.entities[id] = Spawn.entity(entity);
    }
  },
  updateEntities(data) {
    for (const entity of data.items) {
      const id = Number(entity.id);
      const dat = entity!;
      gameState.entities[id].accept(dat);
    }
  },
  closeEntities(data) {
    for (const id of data.ids) {
      delete gameState.entities[Number(id)];
    }
  },
  close(reason) {
    set({ reason });
  },
  clear() {
    set({
      selfId: -1,
      players: {},
      messages: [],
      isGameInit: false,
      reason: "",
    });
    gameState = {
      areaBoundary: { w: 0, h: 0 },
      zones: [],
      entities: {},
      players: {},
      world: "",
      area: 0,
    };
    useKeyboard.getState().clearMovement();
    useMouseStore.setState({ enable: false });
  },
}));
