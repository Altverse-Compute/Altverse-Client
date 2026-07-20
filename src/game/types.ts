export enum WorldEffect {
  RainStorm = "RainStorm",
  SnowStorm = "SnowStorm",
  Rain = "Rain",
  Snow = "Snow",
  LeafFall = "LeafFall",
}

export enum PlayerBitMask {
  Name = 0,
  Id,
  Pos,
  Radius,
  Vel,
  Acc,
  Slide,
  Speed,
  Energy,
  MaxEnergy,
  Died,
  Regeneration,
  World,
  Area,
  DeathTimer,
  Immortal,
  State,
  StateMetadata,
  Hero,
}

export enum EntityBitMask {
  TypeId = 0,
  Radius,
  Speed,
  Harmless,
  Pos,
  State,
  StateMetadata,
  Alpha,
}

export interface PartialPlayer {
  id: number;
  x?: number;
  y?: number;
  radius?: number;
  speed?: number;
  energy?: number;
  maxEnergy?: number;
  deathTimer?: number;
  state?: number;
  stateMetadata?: number;
  area?: number;
  world?: string;
  died?: boolean;
}

export interface PackedPlayer {
  id: number;
  name: string;
  x: number;
  y: number;
  radius: number;
  speed: number;
  energy: number;
  maxEnergy: number;
  deathTimer: number;
  state: number;
  stateMetadata: number;
  area: number;
  world: string;
  died: boolean;
  hero: number;
}

export interface PartialEntity {
  id: number;
  x?: number;
  y?: number;
  radius?: number;
  harmless?: boolean;
  state?: number;
  stateMetadata?: number;
  alpha?: number;
}

export interface PackedEntity {
  id: number;
  typeId: number;
  x: number;
  y: number;
  radius: number;
  harmless: boolean;
  state: number;
  stateMetadata: number;
  alpha: number;
}

export interface AreaInit {
  w: number;
  h: number;
  area: number;
  world: string;
  entities: PackedEntity[];
}

export type MySelf = PackedPlayer;

export type UpdateEntities = Array<PartialEntity>;

export type UpdatePlayers = Array<PartialPlayer>;

export interface Chat {
  id: number;
  content: string;
  author: string;
  world: string;
}
