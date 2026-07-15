import { create } from "zustand";
import Entity from "../game/units/entity";
import { Player } from "../game/units/player";
import Zone from "../game/units/zone";
import { Spawn } from "../game/spawner";
import { useKeyboard } from "./keyboard";
import { useMouseStore } from "./mouse";
import * as server from "@proto/altverse-server.ts";
import { PackageReaderWrapper } from "../game/wrapper";

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
  role: server.Role;
  world: string;
};

interface State {
  selfId: number;
  players: Record<string, ShortPlayer>;
  messages: Array<Chat>;
  isGameInit: boolean;
  reason?: string;

  message(data: server.Chat): void;
  uplayers(data: server.Players): void;
  self(data: server.PackedPlayer): void;
  areaInit(data: server.PackedArea): void;
  newPlayer(data: server.PackedPlayer): void;
  closePlayer(data: number | BigInt | null | undefined): void;
  updatePlayers(data: server.UpdatePlayers): void;
  newEntities(data: server.Entities): void;
  updateEntities(data: server.UpdateEntities): void;
  closeEntities(data: server.CloseEntities): void;
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
          author: data.author()!,
          content: data.content()!,
          id: Number(data.id()),
          role: data.role(),
          world: data.world()!,
        },
      ],
    });
  },
  uplayers(data) {
    for (let i = 0; i < data.playersLength(); i++) {
      const player = data.players(i);
      if (player === null) continue;
      const p = Number(player.key()!);
      const v = player.value()!;
      gameState.players[p] = Spawn.player(v);
      const players = get().players;
      set({
        players: {
          ...players,
          [p]: {
            name: v.name(),
            area: Number(v.area()),
            hero: "",
            world: v.world(),
          },
        },
      });
    }
  },
  self(data) {
    set({ selfId: Number(data.id())!, isGameInit: true });
    gameState.players[Number(data.id()!)] = Spawn.player(data);
  },
  areaInit(data) {
    gameState.entities = {};
    for (let index = 0; index < data.entitiesLength(); index++) {
      const entity = data.entities(index);
      const key = entity!.key();
      const value = entity!.value()!;
      gameState.entities[Number(key)] = Spawn.entity(value);
    }
    // let clientData: ClientArea | undefined;
    // const areas = useAssetsStore.getState().worlds[data.world].areas;
    // if (Object.keys(areas).includes(data.area + ""))
    //   clientData = areas[data.area];

    // if (clientData && clientData.win)
    const w = data.w();
    const h = data.h();
    const world = data.world();
    const area = data.area();
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
    const id = Number(data.id());
    gameState.players[id] = Spawn.player(data);
    const players = get().players;
    set({
      players: {
        ...players,
        [id]: {
          area: Number(data.area()),
          world: data.world(),
          hero: data.hero(),
          name: data.name(),
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
    for (let index = 0; index < data.itemsLength(); index++) {
      const body = data.items(index);
      if (!body) continue;

      const key = Number(body.key()!);
      const value = body.value()!;

      const decoded = new PackageReaderWrapper(value.dataArray()!).readPlayer(
        value.mask(),
      );

      gameState.players[key].accept(decoded);
      const state = get().players;
      const deathTimer = decoded.deathTimer;
      const died = decoded.died;
      const world = decoded.world;
      const area = Number(decoded.area);
      if (
        (deathTimer !== null && state[key].dt !== deathTimer) ||
        (died !== undefined && state[key].died !== died) ||
        (world !== undefined && state[key].world !== world) ||
        (area !== undefined && state[key].area !== Number(area))
      ) {
        set({
          players: {
            ...state,
            [key]: {
              ...state[key],
              world: world ?? state[key].world,
              area: area ?? state[key].area,
              dt:
                deathTimer !== undefined
                  ? Math.floor(deathTimer!)
                  : state[key].dt,
              died: died != undefined ? died : state[key].died,
            },
          },
        });
      }
    }
  },
  newEntities(data) {
    for (let index = 0; index < data.entitiesLength(); index++) {
      let body = data.entities(index);
      if (!body) continue;
      const id = Number(body.key());
      const dat = body.value()!;
      gameState.entities[id] = Spawn.entity(dat);
    }
  },
  updateEntities(data) {
    for (let index = 0; index < data.itemsLength(); index++) {
      let body = data.items(index);
      if (!body) continue;
      const id = Number(body.key());
      const dat = body.value()!;
      const decoded = new PackageReaderWrapper(dat.dataArray()!).readEntity(
        dat.mask(),
      );
      gameState.entities[id].accept(decoded);
    }
  },
  closeEntities(data) {
    for (let index = 0; index < data.idsLength(); index++) {
      let id = Number(data.ids(index));
      delete gameState.entities[id];
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
