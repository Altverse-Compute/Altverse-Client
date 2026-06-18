export interface RawClient {
  fillStyle: string;
  strokeStyle: string;
  areaFill: string;
  areaAlpha?: number;
  backgrounds?: Array<[string, number]>;
  effect: WorldEffect;
}

export enum WorldEffect {
  Rain = 0,
  RainStorm,
  Snow,
  SnowStorm,
  Autumn,
}

export interface ClientWorld {
  client: RawClient;
  areas: Record<number, ClientArea>;
}

export interface ClientArea {
  win?: boolean;
  vp?: number;
  text?: string;
}

export interface AssetsWorld {
  effect?: WorldEffect;
  backgrounds?: Array<[string, number]>;
  fillColor: string;
  fillAlpha: number;
}

export interface AssetsZone {
  fillColor: string;
}

export type AssetsEntity = [string];

export interface Assets {
  textures: Record<string, string>;
  zones: Record<string, AssetsZone>;
  entities: Array<AssetsEntity>;
}
