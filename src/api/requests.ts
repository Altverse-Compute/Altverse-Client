import type { ClientWorld } from "shared";
import { config } from "../config";
import type {
  RegisterProps,
  ApiResponse,
  LoginProps,
  LoginResponse,
  CheckResponse,
  RegisterResponse,
  ProfileResponse,
} from "./types";

export class ApiRequests {
  public static register(props: RegisterProps): Promise<RegisterResponse> {
    return ApiRequests.post("/register", props);
  }

  public static login(props: LoginProps): Promise<LoginResponse> {
    return ApiRequests.post<LoginResponse>("/login", props);
  }

  public static check(token: string): Promise<CheckResponse> {
    return ApiRequests.post<CheckResponse>("/check", {
      token,
    });
  }

  public static worlds(): Promise<Record<string, ClientWorld>> {
    return ApiRequests.get<Record<string, ClientWorld>>("/worlds");
  }

  public static profile(username: string): Promise<ProfileResponse> {
    return ApiRequests.get<ProfileResponse>("/profile/" + username);
  }

  public static logout(token: string): Promise<CheckResponse> {
    return ApiRequests.post<CheckResponse>("/logout", {
      token,
    });
  }

  private static post = <T extends ApiResponse<{}>>(
    url: string,
    body: unknown,
    withCredentials: boolean = false,
  ) =>
    ApiRequests.fetch<T>({
      url,
      method: "POST",
      withCredentials,
      body,
    });

  // private static put = <T extends ApiResponse<{}>>(
  //   url: string,
  //   body: unknown,
  //   withCredentials: boolean = false
  // ) =>
  //   ApiRequests.fetch<T>({
  //     url,
  //     method: "PUT",
  //     withCredentials,
  //     body,
  //   });

  private static get = <T extends object>(
    url: string,
    withCredentials: boolean = false,
  ) =>
    ApiRequests.fetch<T>({
      url,
      method: "GET",
      withCredentials,
    });

  private static fetch<T extends object>(options: {
    url: string;
    method: "POST" | "PUT" | "GET";
    withCredentials: boolean;
    body?: unknown;
  }) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    return fetch(config.api + options.url, {
      method: options.method,
      headers: options.method === "GET" ? undefined : headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: options.withCredentials ? "include" : "omit",
    }).then((res) => {
      return res.json() as Promise<T>;
    });
  }
}
