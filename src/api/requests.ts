import { config } from "../config";
import type { RegisterProps, LoginProps, AdminEditServerProps } from "./types";
import { http } from "../proto/generated/js";
import { useAuthStore } from "../stores/auth";

type ApiResponse<T> = T & { status: http.ResponseStatus };

export class ApiRequests {
  public static async register(
    props: RegisterProps,
  ): Promise<ApiResponse<http.LoginAndRegisterResponse>> {
    const response = await ApiRequests.post("/register", props);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.LoginAndRegisterResponse,
    );
  }

  public static async login(
    props: LoginProps,
  ): Promise<ApiResponse<http.LoginAndRegisterResponse>> {
    const response = await ApiRequests.post("/login", props);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.LoginAndRegisterResponse,
    );
  }

  public static async check(): Promise<ApiResponse<http.AuthResponse>> {
    const response = await ApiRequests.get("/auth");
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.AuthResponse,
    );
  }

  public static async profile(
    username: string,
  ): Promise<ApiResponse<http.ProfileResponse>> {
    const response = await ApiRequests.get("/profile/" + username);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.ProfileResponse,
    );
  }

  public static async servers(): Promise<http.ServersResponse> {
    const response = await ApiRequests.get("/servers");
    return http.ServersResponse.decode(await response.bytes());
  }

  public static async logout(): Promise<ApiResponse<http.LogoutResponse>> {
    const response = await ApiRequests.post("/logout", undefined);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.LogoutResponse,
    );
  }

  public static async adminServers(): Promise<
    ApiResponse<http.AdminModeServersResponse>
  > {
    if (useAuthStore.getState().profile?.role !== http.AccountRole.ADMIN)
      return {
        ...http.AdminModeServersResponse.create({
          servers: [],
          online: 0,
          count: 0,
        }),
        status: http.ResponseStatus.NotAuthenticated,
      };
    const response = await ApiRequests.get("/admin/servers", undefined);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.AdminModeServersResponse,
    );
  }

  public static async adminServerToken(): Promise<
    ApiResponse<http.AdminModeServerTokenResponse>
  > {
    const response = await ApiRequests.get("/admin/servers/token", undefined);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.AdminModeServerTokenResponse,
    );
  }

  public static async adminServerEdit(
    props: http.IAdminModeEditServerRequest,
  ): Promise<ApiResponse<Object>> {
    const response = await ApiRequests.post("/admin/servers/edit", props);
    return { status: response.status };
  }

  public static async worlds(serverUrl: string): Promise<http.WorldsResponse> {
    const response = await ApiRequests.fetchFromServer({
      url: "/worlds",
      serverUrl,
      method: "GET",
      withCredentials: true,
      body: undefined,
    });
    return http.WorldsResponse.decode(await response.bytes());
  }

  private static handleErrorResponse<
    Decoder extends {
      create: (obj: object) => Result;
      decode: (bytes: Uint8Array) => Result;
    },
    Result,
  >(
    response: Response,
    bytes: Uint8Array,
    object: Decoder,
  ): ApiResponse<Result> {
    if (Object.keys(http.ResponseStatus).includes(response.status.toString())) {
      return { ...object.decode(bytes), status: response.status };
    }
    return { ...object.decode(bytes), status: http.ResponseStatus.Ok };
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

  private static fetchFromServer(options: {
    url: string;
    serverUrl: string;
    method: "POST" | "PUT" | "GET";
    withCredentials: boolean;
    body?: unknown;
  }) {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    return fetch(options.serverUrl + options.url, {
      method: options.method,
      headers: options.method === "GET" ? undefined : headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      credentials: options.withCredentials ? "include" : "omit",
    });
  }
}
