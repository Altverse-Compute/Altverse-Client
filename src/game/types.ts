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

export interface DecodedPartialPlayer {
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

export interface DecodedPartialEntity {
  x?: number;
  y?: number;
  radius?: number;
  harmless?: boolean;
  state?: number;
  stateMetadata?: number;
  alpha?: number;
}
