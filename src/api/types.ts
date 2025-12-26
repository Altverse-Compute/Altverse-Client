import type { AccountRole } from "../types";

export interface ApiResponse {
  status: ResponseMessage;
} 

export interface RegisterProps {
  username: string;
  password: string;
  token: string;
}

export interface LoginProps {
  username: string;
  password: string;
}

export type LoginResponse = {
  status: ResponseMessage;
  message: ResponseMessage;
  token: string;
  profile?: Profile;
};

export type RegisterResponse = {
  status: ResponseMessage;
  message: ResponseMessage;
  token: string;
  profile?: Profile;
}

export type ProfileResponse = {
  status: ResponseMessage;
  message: ResponseMessage;
  profile?: Profile;
}

export interface Profile {
  vp: number;
  username: string;
  highest: string;
  role: AccountRole;
}

export type CheckResponse = {
  status: ResponseMessage;
  profile: Profile
};

export enum ResponseMessage {
  Ok = "success",
  AccountExists = "account_exists",
  AccountNotExists = "account_not_exists",
  InternalError = "internal_error",
  InvalidBody = "invalid_body",
}
