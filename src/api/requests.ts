import { config } from "../config";
import type { RegisterProps, LoginProps } from "./types";
import { http } from "../proto/generated/js";

export class ApiRequests {
  public static async register(
    props: RegisterProps,
  ): Promise<http.LoginAndRegisterResponse> {
    const response = await ApiRequests.post("/register", props);
    return http.LoginAndRegisterResponse.decode(await response.bytes());
  }

  public static async login(
    props: LoginProps,
  ): Promise<http.LoginAndRegisterResponse> {
    const response = await ApiRequests.post("/login", props);
    return http.LoginAndRegisterResponse.decode(await response.bytes());
  }

  public static async check(): Promise<http.AuthResponse> {
    const response = await ApiRequests.get("/auth");
    return http.AuthResponse.decode(await response.bytes());
  }

  public static async profile(username: string): Promise<http.ProfileResponse> {
    const response = await ApiRequests.get("/profile/" + username);
    return http.ProfileResponse.decode(await response.bytes());
  }

  public static async servers(): Promise<http.ServersResponse> {
    const response = await ApiRequests.get("/servers");
    return http.ServersResponse.decode(await response.bytes());
  }

  public static async logout(token: string): Promise<http.LogoutResponse> {
    const response = await ApiRequests.post("/logout", {
      token,
    });
    return http.LogoutResponse.decode(await response.bytes());
  }

  private static post = (
    url: string,
    body: unknown,
    withCredentials: boolean = true,
  ) =>
    ApiRequests.fetch({
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

  private static get = (url: string, withCredentials: boolean = true) =>
    ApiRequests.fetch({
      url,
      method: "GET",
      withCredentials,
    });

  private static fetch(options: {
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
    });
  }
}
