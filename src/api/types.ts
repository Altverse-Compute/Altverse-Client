import type { AccountRole } from "shared";

export interface ApiResponse<T extends object> {
  successful: boolean;
  data: T;
}

export interface RegisterProps {
  username: string;
  password: string;
  registerToken: string;
}

export interface LoginProps {
  username: string;
  password: string;
}

export type LoginResponse = ApiResponse<{
  message: ResponseMessage;
  token: string;
  profile?: Profile;
}>;

export type RegisterResponse = ApiResponse<{
  message: ResponseMessage;
  token: string;
  profile?: Profile;
}>;

export type ProfileResponse = ApiResponse<{
  message: ResponseMessage;
  profile?: Profile;
}>;

export interface Profile {
  vp: number;
  username: string;
  highest: string;
  role: AccountRole;
}

export type CheckResponse = ApiResponse<{
  message: ResponseMessage;
  valid: boolean;
}>;

export enum ResponseMessage {
  Ok = "all_ok",
  AccountExists = "account_exists",
  AccountNotExists = "account_not_exists",
  InternalError = "internal_error",
  InvalidBody = "invalid_body",
}
