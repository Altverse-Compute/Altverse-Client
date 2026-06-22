import { keyboardEvents, localToProto } from "./events/keyboard";
import { mouseEvents } from "./events/mouse";
import { useGameStore } from "../stores/game";
import * as game from "@proto/game_pb.ts";
import { Compress } from "./compress.ts";
import Cookies from "js-cookie";
import {
  create,
  fromBinary,
  toBinary,
  type DescMessage,
  type Message,
  type MessageInitShape,
} from "@bufbuild/protobuf";

export class WebSocketConnection {
  open: boolean = false;
  // reason: string = "";
  kBPerPackage = 0;
  kBPerSecond = 0;
  rawPPS = 0;
  packagesPerSecond = 0;
  private ws?: WebSocket;

  // disconnect() {
  //   if (this.open) {
  //     this.ws!.close();
  //   }
  // }

  sendMessage(msg: string) {
    if (this.open) {
      this.ws!.send(
        JSON.stringify({
          message: msg,
        }),
      );
    }
  }

  connect(api: string) {
    this.ws = new WebSocket(api.replace("http", "ws"), ["permessage-deflate"]);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = () => {
      setTimeout(() => {
        this.wrapAndSend(game.ClientInitSchema, {
          pkg: {
            case: "init",
            value: {
              hero: "",
            },
          },
        });
      }, 100);
      this.open = true;
    };
    this.ws.onclose = (event) => {
      this.open = false;
      console.log(event.code);
      if (event.reason.length === 0) {
        useGameStore.setState({ reason: "Server disconnected you" });
        return;
      }
      useGameStore.setState({ reason: event.reason });
    };
    this.ws.onerror = () => {
      this.open = false;
    };
    this.ws.onmessage = (event) => this.onMessage(event);

    setInterval(() => {
      this.kBPerSecond = Math.round((this.kBPerPackage / 1024) * 10) / 10;
      this.kBPerPackage = 0;
      this.packagesPerSecond = this.rawPPS;
      this.rawPPS = 0;
    }, 1000);
  }

  wrapAndSend(schema: DescMessage, object: MessageInitShape<typeof schema>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws!.send(toBinary(schema, create(schema, object)));
    }
  }

  link() {
    mouseEvents.on("move", (mousePos) => {
      if (this.open) {
        this.wrapAndSend(game.ClientMousePosSchema, {
          mousePos,
        });
      }
    });
    mouseEvents.on("enable", (mouseEnable) => {
      if (this.open) {
        this.wrapAndSend(game.ClientMousePosSchema, {
          mouseEnable,
        });
      }
    });
    keyboardEvents.on("down", (key) => {
      if (this.open) {
        if (key === "first" || key === "second") {
          this.wrapAndSend(game.ClientMousePosSchema, {
            ability:
              key === "first"
                ? game.ClientAbility.FIRST
                : game.ClientAbility.SECOND,
          });
        } else if (key.indexOf("upgrade_") === -1)
          this.wrapAndSend(game.ClientMousePosSchema, {
            keyDown: localToProto[key],
          });
      }
    });

    keyboardEvents.on("up", (key) => {
      if (key.indexOf("upgrade_") === -1)
        this.wrapAndSend(game.ClientMousePosSchema, {
          keyUp: localToProto[key],
        });
    });
  }

  private onMessage = (event: MessageEvent) => {
    const uint8 = new Uint8Array(event.data);
    this.kBPerPackage += uint8.byteLength;
    const packages = fromBinary(game.PackagesSchema, Compress.decode(uint8));
    const gameService = useGameStore.getState();
    this.rawPPS++;

    for (let index = 0; index < packages.items.length; index++) {
      const pkg = packages.items[index].kind;
      const data = pkg.value!;
      const key = pkg.case!;
      console.log(key, data);
      try {
        switch (key) {
          case "chatMessage":
            gameService.message(data as game.Chat);
            break;
          case "players":
            gameService.uplayers(data as game.Players);
            break;
          case "myself":
            gameService.self(data as game.PackedPlayer);
            break;
          case "areaInit":
            gameService.areaInit(data as game.PackedArea);
            break;
          case "newPlayer":
            gameService.newPlayer(data as game.PackedPlayer);
            break;
          case "closePlayer":
            gameService.closePlayer(data as BigInt);
            break;
          case "updatePlayers":
            if (data != null)
              gameService.updatePlayers(data as game.UpdatePlayersMap);
            break;
          case "newEntities":
            if (data) gameService.newEntities(data as game.Entities);
            break;
          case "updateEntities":
            gameService.updateEntities(data as game.UpdateEntitiesMap);
            break;
          case "closeEntities":
            gameService.closeEntities(data as game.CloseEntities);
            break;
        }
      } catch (e) {
        console.error(e);
      }
    }
  };
}

export const webSocketConnection = new WebSocketConnection();
