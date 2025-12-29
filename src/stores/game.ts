import {create} from "zustand";
import Entity from "../game/units/entity";
import {Player} from "../game/units/player";
import Zone from "../game/units/zone";
import {Spawn} from "../game/spawner";
import {useKeyboard} from "./keyboard";
import {useMouseStore} from "./mouse";
import {game} from "../proto/generated/js";

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

interface State {
  selfId: number;
  players: Record<string, ShortPlayer>;
  messages: Array<game.IChat>;
  isGameInit: boolean;
  reason?: string;

  message(data: game.IChat): void;
  uplayers(data: game.IPlayers): void;
  self(data: game.IPackedPlayer): void;
  areaInit(data: game.IPackedArea): void;
  newPlayer(data: game.IPackedPlayer): void;
  closePlayer(data: number | Long | null | undefined): void;
  updatePlayers(data: game.IUpdatePlayersMap): void;
  newEntities(data: Record<number, game.IPackedEntity>): void;
  updateEntities(data: game.IUpdateEntitiesMap): void;
  closeEntities(data: number[]): void;
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
      messages: [...old.messages, data],
    });
  },
  uplayers(data: Record<number, game.PackedPlayer>) {
    for (const p in data) {
      const player = data[p];
      gameState.players[p] = Spawn.player(player);
      const players = get().players;
      set({
        players: {
          ...players,
          [p]: {
            name: player.name,
            area: player.area,
            hero: "",
            world: player.world,
          },
        },
      });
    }
  },
  self(data) {
    set({ selfId: data.id!, isGameInit: true });
    gameState.players[data.id!] = Spawn.player(data as game.PackedPlayer);
  },
  areaInit(data) {
    gameState.entities = {};
    for (const key in Object.keys(data.entities!)) {
      gameState.entities[key] = Spawn.entity(data.entities![key] as game.PackedEntity);
    }
    // let clientData: ClientArea | undefined;
    // const areas = useAssetsStore.getState().worlds[data.world].areas;
    // if (Object.keys(areas).includes(data.area + ""))
    //   clientData = areas[data.area];

    // if (clientData && clientData.win)
    gameState.zones = [
      new Zone({
        x: -10 * 32,
        y: 0,
        w: 2 * 32,
        h: data.h!,
        type: "teleport",
      }),
      new Zone({
        x: -8 * 32,
        y: 0,
        w: data.w! + 16 * 32,
        h: data.h!,
        type: "victory",
      }),
      new Zone({
        x: data.w! + 8 * 32,
        y: 0,
        w: 2 * 32,
        h: data.h!,
        type: "exit",
      }),
    ];
    // else
    gameState.zones = [
      ...(data.area === 0
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
              h: data.h! - 2 * 32,
              type: "safe",
            }),
            new Zone({
              x: -10 * 32,
              y: data.h! - 2 * 32,
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
              h: data.h!,
              type: "teleport",
            }),
            new Zone({
              x: -8 * 32,
              y: 0,
              w: 8 * 32,
              h: data.h!,
              type: "safe",
            }),
          ]),
      new Zone({
        x: 0,
        y: 0,
        w: data.w!,
        h: data.h!,
        type: "active",
      }),
      new Zone({
        x: data.w!,
        y: 0,
        w: 8 * 32,
        h: data.h!,
        type: "safe",
      }),
      new Zone({
        x: data.w! + 8 * 32,
        y: 0,
        w: 2 * 32,
        h: data.h!,
        type: "teleport",
      }),
    ];

    gameState.world = data.world!;
    gameState.area = data.area! as number;
    gameState.areaBoundary = {
      w: data.w!,
      h: data.h!,
    };
  },
  newPlayer(data) {
    gameState.players[data.id!] = Spawn.player(data as game.PackedPlayer);
    const players = get().players;
    set({
      players: {
        ...players,
        [data.id!]: data,
      },
    });
  },
  closePlayer(data) {
    if (Object.keys(gameState.players).includes(data + "")) {
      delete gameState.players[data as number];
      let players = get().players;
      let out: Record<number, ShortPlayer> = {};
      for (const i in players) {
        if (Number(i) !== data) out[Number(i)] = players[i];
      }
      set({
        players: out,
      });
    }
  },
  updatePlayers(data) {
    for (const p in data) {
      //@ts-ignore
      const val = data[p] as any
      gameState.players[p as any as number].accept(val);
      const state = get().players;
      if (
        (val!.deathTimer !== undefined &&
          state[p].dt !== val.deathTimer) ||
        (val!.died !== undefined &&
          state[p].died !== Boolean(val.died)) ||
        (val!.world !== undefined && state[p].world !== val.world) ||
        (val!.area !== undefined && state[p].area !== val.area)
      ) {
        set({
          players: {
            ...state,
            [p]: {
              ...state[p],
              name: val.name ?? state[p].name,
              world: val.world ?? state[p].world,
              area: val.area ?? state[p].area,
              dt:
                val.deathTimer !== undefined
                  ? val.deathTimer
                  : state[p].dt,
              died: val.died != undefined  ? val.died : state[p].died,
            },
          },
        });
      }
    }
  },
  newEntities(data) {
    for (const id in data) {
      gameState.entities[id] = Spawn.entity(data[id]);

    }
  },
  updateEntities(data) {
    for (const e in data.items) {
      gameState.entities[e as any as number].accept(data.items[e] as any);
    }
  },
  closeEntities(data) {
    for (const i of data) {
      delete gameState.entities[i];
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
