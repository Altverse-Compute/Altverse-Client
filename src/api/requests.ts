import { config } from "../config";
import type { RegisterProps, LoginProps, AdminEditServerProps } from "./types";
import { useAuthStore } from "../stores/auth";
import * as http from "@proto/http_pb";
import { fromBinary, type DescMessage, type Message } from "@bufbuild/protobuf";

type ApiResponse<T> = T & { status: http.ResponseStatus };

export class ApiRequests {
  public static async register(
    props: RegisterProps,
  ): Promise<ApiResponse<http.LoginAndRegisterResponse>> {
    const response = await ApiRequests.post("/register", props);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.LoginAndRegisterResponseSchema,
    );
  }

  public static async login(
    props: LoginProps,
  ): Promise<ApiResponse<http.LoginAndRegisterResponse>> {
    const response = await ApiRequests.post("/login", props);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.LoginAndRegisterResponseSchema,
    );
  }

  public static async check(): Promise<ApiResponse<http.AuthResponse>> {
    const response = await ApiRequests.get("/auth");
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.AuthResponseSchema,
    );
  }

  public static async profile(
    username: string,
  ): Promise<ApiResponse<http.ProfileResponse>> {
    const response = await ApiRequests.get("/profile/" + username);
    const bytes = await response.bytes();
    console.log(bytes);
    return this.handleErrorResponse(
      response,
      bytes,
      http.ProfileResponseSchema,
    );
  }

  public static async servers(): Promise<ApiResponse<http.ServersResponse>> {
    const response = await ApiRequests.get("/servers");
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.ServersResponseSchema,
    );
  }

  public static async logout(): Promise<ApiResponse<http.LogoutResponse>> {
    const response = await ApiRequests.post("/logout", undefined);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.LogoutResponseSchema,
    );
  }

  public static async adminServers(): Promise<
    ApiResponse<http.AdminModeServersResponse>
  > {
    if (useAuthStore.getState().profile?.role !== http.AccountRole.ADMIN)
      return {
        ...({
          servers: [],
          online: 0,
          count: 0,
        } as unknown as Message<"altverse.game.http.v1.AdminModeServersResponse">),
        status: http.ResponseStatus.NotAuthenticated,
      };
    const response = await ApiRequests.get("/admin/servers", undefined);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.AdminModeServersResponseSchema,
    );
  }

  public static async adminServerToken(): Promise<
    ApiResponse<http.AdminModeServerTokenResponse>
  > {
    const response = await ApiRequests.get("/admin/servers/token", undefined);
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.AdminModeServerTokenResponseSchema,
    );
  }

  public static async adminServerEdit(
    props: http.AdminModeEditServerRequest,
  ): Promise<ApiResponse<any>> {
    const response = await ApiRequests.post("/admin/servers/edit", props);
    return { status: response.status };
  }

  public static async adminServerAdd(
    props: http.AdminModeAddServerRequest,
  ): Promise<ApiResponse<any>> {
    const response = await ApiRequests.post("/admin/servers/add", props);
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
    return this.handleErrorResponse(
      response,
      await response.bytes(),
      http.WorldsResponseSchema,
    );
  }

  private static handleErrorResponse(
    response: Response,
    bytes: Uint8Array,
    schema: DescMessage,
  ): ApiResponse<Message<any>> {
    for (const index of Object.keys(http.ResponseStatus)) {
      if (
        (http.ResponseStatus[index as any as number] as any as number) ===
        response.status
      ) {
        return { ...fromBinary(schema, bytes), status: response.status };
      }
    }
    return { ...fromBinary(schema, bytes), status: http.ResponseStatus.Ok };
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
