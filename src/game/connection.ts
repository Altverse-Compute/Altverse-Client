import { keyboardEvents } from "./events/keyboard";
import { mouseEvents } from "./events/mouse";
import { useAuthStore } from "../stores/auth";
import { useGameStore } from "../stores/game";
import { config } from "../config";
import { game } from "../proto/generated/js";
import { Compress } from "./compress.ts";

export class WebSocketConnection {
  open: boolean = false;
  reason: string = "";
  kBPerPackage = 0;
  kBPerSecond = 0;
  rawPPS = 0;
  packagesPerSecond = 0;
  private ws?: WebSocket;

  disconnect() {
    if (this.open) {
      this.ws!.close();
    }
  }

  sendMessage(msg: string) {
    if (this.open) {
      this.ws!.send(
        JSON.stringify({
          message: msg,
        })
      );
    }
  }

  connect() {
    this.ws = new WebSocket(config.api.replace("http", "ws") + "/server", [
      "permessage-deflate",
    ]);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = () => {
      this.ws!.send(
        JSON.stringify({
          init: {
            hero: "",
            session: useAuthStore.getState().token,
          },
        })
      );
      this.open = true;
    };
    this.ws.onclose = (event) => {
      this.open = false;
      if (event.reason.length === 0) {
        useGameStore.setState({ reason: "Server disconnected you" });
        return;
      }
      useGameStore.setState({ reason: event.reason });
    };
    this.ws.onerror = () => {
      this.open = false;
    };
    this.ws.onmessage = this.onMessage;

    setInterval(() => {
      this.kBPerSecond = Math.round((this.kBPerPackage / 1024) * 10) / 10;
      this.kBPerPackage = 0;
      this.packagesPerSecond = this.rawPPS;
      this.rawPPS = 0;
    }, 1000);
  }

  link() {
    mouseEvents.on("move", (event) => {
      if (this.open) {
        this.ws!.send(
          JSON.stringify({
            mousePos: [event.x, event.y],
          })
        );
      }
    });
    mouseEvents.on("enable", (event) => {
      if (this.open) {
        this.ws!.send(
          JSON.stringify({
            mouseEnable: event,
          })
        );
      }
    });
    keyboardEvents.on("down", (key) => {
      if (this.open) {
        if (key === "first" || key === "second") {
          this.ws!.send(
            JSON.stringify({
              ability: key,
            })
          );
        } else if (key.indexOf("upgrade_") === -1)
          this.ws!.send(
            JSON.stringify({
              keyDown: key,
            })
          );
      }
    });

    keyboardEvents.on("up", (key) => {
      if (key.indexOf("upgrade_") === -1)
        this.ws!.send(
          JSON.stringify({
            keyUp: key,
          })
        );
    });
  }

  private onMessage = (event: MessageEvent) => {
    const uint8 = new Uint8Array(event.data);
    this.kBPerPackage += uint8.byteLength;
    const packages = game.Packages.decode(Compress.decode(uint8))
    const gameService = useGameStore.getState();
    this.rawPPS++;

    for (let index = 0; index < packages.items.length; index++) {
      const data = packages.items[index];
      try {

        switch (Object.keys(data)[0]) {
          // case "message":
          //   gameService.message(data.message);
          //   break;
          case "players":
            gameService.uplayers(data.players!.players!);
            break;
          case "myself":
            gameService.self(data.myself!);
            break;
          case "areaInit":
            gameService.areaInit(data.areaInit!);
            break;
          case "newPlayer":
            gameService.newPlayer(data.newPlayer!);
            break;
          case "closePlayer":
            gameService.closePlayer(data.closePlayer);
            break;
          case "updatePlayers":
            if (data.updatePlayers != null)
            gameService.updatePlayers(data.updatePlayers.items!);
            break;
          case "newEntities":
            if (data.newEntities)
            gameService.newEntities(data.newEntities.entities!);
            break;
          case "updateEntities":
            gameService.updateEntities(data.updateEntities!);
            break;
          case "closeEntities":
            gameService.closeEntities(data.closeEntities!.ids!);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
}

export const webSocketConnection = new WebSocketConnection();
