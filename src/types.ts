import type { WorldEffect } from "./proto/generated/ts/http/WorldEffect";

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
