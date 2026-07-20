import { keyboardEvents, localToProto } from "./events/keyboard";
import { mouseEvents } from "./events/mouse";
import { useGameStore } from "../stores/game";
import * as game from "@proto/game_pb.ts";
import * as flatbuffers from "flatbuffers";
import {
  create,
  toBinary,
  type DescMessage,
  type MessageInitShape,
} from "@bufbuild/protobuf";
import { Packages } from "./pulse";

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

  sendChat(msg: string) {
    if (this.open) {
      this.ws!.send(
        toBinary(
          game.ClientMessageSchema,
          create(game.ClientMessageSchema, {
            pkg: {
              case: "chatMessage",
              value: msg,
            },
          }),
        ),
      );
    }
  }

  connect(api: string) {
    this.ws = new WebSocket(api.replace("http", "ws"), ["permessage-deflate"]);
    this.ws.binaryType = "arraybuffer";
    this.ws.onopen = () => {
      setTimeout(() => {
        this.ws!.send(
          toBinary(
            game.ClientMessageSchema,
            create(game.ClientMessageSchema, {
              pkg: {
                case: "init",
                value: {
                  hero: "",
                },
              },
            }),
          ),
        );
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
    }
  }

  link() {
    mouseEvents.on("move", (mousePos) => {
      if (this.open) {
        this.ws!.send(
          toBinary(
            game.ClientMessageSchema,
            create(game.ClientMessageSchema, {
              pkg: {
                case: "mousePos",
                value: {
                  ...mousePos,
                },
              },
            }),
          ),
        );
      }
    });
    mouseEvents.on("enable", (mouseEnable) => {
      if (this.open) {
        this.ws!.send(
          toBinary(
            game.ClientMessageSchema,
            create(game.ClientMessageSchema, {
              pkg: {
                case: "mouseEnable",
                value: mouseEnable,
              },
            }),
          ),
        );
      }
    });
    keyboardEvents.on("down", (key) => {
      if (this.open) {
        if (key === "first" || key === "second") {
          this.ws!.send(
            toBinary(
              game.ClientMessageSchema,
              create(game.ClientMessageSchema, {
                pkg: {
                  case: "ability",
                  value:
                    key === "first"
                      ? game.ClientAbility.FIRST
                      : game.ClientAbility.SECOND,
                },
              }),
            ),
          );
        } else if (key.indexOf("upgrade_") === -1)
          this.ws!.send(
            toBinary(
              game.ClientMessageSchema,
              create(game.ClientMessageSchema, {
                pkg: {
                  case: "keyDown",
                  value: localToProto[key],
                },
              }),
            ),
          );
      }
    });

    keyboardEvents.on("up", (key) => {
      if (key.indexOf("upgrade_") === -1)
        this.ws!.send(
          toBinary(
            game.ClientMessageSchema,
            create(game.ClientMessageSchema, {
              pkg: {
                case: "keyUp",
                value: localToProto[key],
              },
            }),
          ),
        );
    });
  }

  private onMessage = (event: MessageEvent) => {
    const uint8 = new Uint8Array(event.data);
    console.log(event.data);
    this.kBPerPackage += uint8.byteLength;
    //const flat = new flatbuffers.ByteBuffer(uint8);
    //const packages = AltverseServer.Packages.getRootAsPackages(flat);
    const gameService = useGameStore.getState();
    this.rawPPS++;

    const packages = Packages.fromUint8Array(uint8);

    for (const pkg of packages.items) {
      if (pkg.area_init) {
        gameService.areaInit(pkg.area_init);
      }
      if (pkg.chat) {
        gameService.message(pkg.chat);
      }
      if (pkg.close_entities) {
        gameService.closeEntities(pkg.close_entities);
      }
      if (pkg.close_player) {
        gameService.closePlayer(pkg.close_player);
      }
      if (pkg.myself) {
        gameService.self(pkg.myself);
      }
      if (pkg.new_entities) {
        gameService.newEntities(pkg.new_entities);
      }
      if (pkg.new_player) {
        gameService.newPlayer(pkg.new_player);
      }
      if (pkg.players) {
        gameService.uplayers(pkg.players);
      }
      if (pkg.update_entities) {
        gameService.updateEntities(pkg.update_entities);
      }
      if (pkg.update_players) {
        gameService.updatePlayers(pkg.update_players);
      }
    }

    // for (let index = 0; index < packages.itemsLength(); index++) {
    //   const pkg = packages.items(index);
    //   if (pkg === null) continue;
    //   try {
    //     let type = pkg.kindType();
    //     if (type === PackageKind.new_player) {
    //       let data = pkg.kind(
    //         new AltverseServer.PackedPlayer(),
    //       ) as AltverseServer.PackedPlayer;
    //       gameService.newPlayer(data);
    //       continue;
    //     }
    //     if (type === PackageKind.close_player) {
    //       let data = pkg.kind(
    //         new AltverseServer.ClosePlayer(),
    //       ) as AltverseServer.ClosePlayer;
    //       gameService.closePlayer(data.id());
    //       continue;
    //     }
    //     if (type === PackageKind.players) {
    //       let data = pkg.kind(
    //         new AltverseServer.Players(),
    //       ) as AltverseServer.Players;
    //       gameService.uplayers(data);
    //       continue;
    //     }
    //     if (type === PackageKind.new_entities) {
    //       let data = pkg.kind(
    //         new AltverseServer.Entities(),
    //       ) as AltverseServer.Entities;
    //       gameService.newEntities(data);
    //       continue;
    //     }
    //     if (type === PackageKind.close_entities) {
    //       let data = pkg.kind(
    //         new AltverseServer.CloseEntities(),
    //       ) as AltverseServer.CloseEntities;
    //       gameService.closeEntities(data);
    //       continue;
    //     }
    //     if (type === PackageKind.area_init) {
    //       let data = pkg.kind(
    //         new AltverseServer.PackedArea(),
    //       ) as AltverseServer.PackedArea;
    //       gameService.areaInit(data);
    //       continue;
    //     }
    //     if (type === PackageKind.myself) {
    //       let data = pkg.kind(
    //         new AltverseServer.PackedPlayer(),
    //       ) as AltverseServer.PackedPlayer;
    //       gameService.self(data);
    //       continue;
    //     }
    //     if (type === PackageKind.update_entities) {
    //       let data = pkg.kind(
    //         new AltverseServer.UpdateEntities(),
    //       ) as AltverseServer.UpdateEntities;
    //       gameService.updateEntities(data);
    //       continue;
    //     }
    //     if (type === PackageKind.update_players) {
    //       let data = pkg.kind(
    //         new AltverseServer.UpdatePlayers(),
    //       ) as AltverseServer.UpdatePlayers;
    //       gameService.updatePlayers(data);
    //       continue;
    //     }
    //     if (type === PackageKind.chat) {
    //       let data = pkg.kind(new AltverseServer.Chat()) as AltverseServer.Chat;
    //       gameService.message(data);
    //       continue;
    //     }
    //   } catch (e) {
    //     console.error(e);
    //   }
    // }
  };
}

export const webSocketConnection = new WebSocketConnection();
