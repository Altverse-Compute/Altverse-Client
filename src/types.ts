import { http } from "./proto/generated/js";
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

export const errorsAndStatusAlias: Record<http.ResponseStatus, string> = {
  [http.ResponseStatus.Ok]: "Ok",
  [http.ResponseStatus.AccountExists]: "Account already exists",
  [http.ResponseStatus.AccountNotExists]: "Account does not exist",
  [http.ResponseStatus.InternalError]:
    "Server has encountered an internal error",
  [http.ResponseStatus.InvalidBody]: "Error with building the request body",
  [http.ResponseStatus.NotFound]: "Not found",
  [http.ResponseStatus.VerificationFailure]: "Verification failure",
  [http.ResponseStatus.NotAuthenticated]: "Not authenticated",
  [http.ResponseStatus.WrongPassword]: "Wrong password",
};
