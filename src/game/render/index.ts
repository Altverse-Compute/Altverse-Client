import { gameState, useGameStore } from "../../stores/game";
import { webSocketConnection } from "../connection";
import AssetLoader from "../storages/assets";
import Camera from "../storages/camera";
import Entity from "../units/entity";
import { Leaf } from "./entities/leaf";
import { useAssetsStore } from "../../stores/assets";
import { WorldEffect, type RawClient } from "../../types";

export const customEntities: Record<string, typeof Entity> = {
  leaf: Leaf,
};

export const customEntitiesKeys = Object.keys(customEntities);

export class Render {
  private static lastUpdateTime: number = Date.now();

  static render(_: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    const currentTime = Date.now();
    const delta = currentTime - Render.lastUpdateTime;
    Render.lastUpdateTime = currentTime;

    // const timeFix = delta / (1000 / 60);
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, Camera.w, Camera.h);
    ctx.fillStyle = "#333";
    ctx.fillRect(0, 0, Camera.w, Camera.h);
    const state = gameState;
    const selfId = useGameStore.getState().selfId;

    if (Object.keys(state.players).includes(selfId + ""))
      Camera.follow(state.players[selfId]);

    for (const z in state.zones) {
      state.zones[z].draw(ctx);
    }
    this.renderBackground(ctx);

    for (const p in state.players) {
      if (
        state.players[p].world === state.world &&
        state.players[p].area == state.area
      )
        state.players[p].draw(ctx, selfId);
    }
    for (const e in state.entities) {
      state.entities[e].drawaura(ctx);
    }
    for (const e in state.entities) {
      state.entities[e].draw(ctx, delta);
    }

    // this.renderEffect(ctx, timeFix);

    ctx.font = '900 35px "Open Sans", sans-serif ';
    ctx.textAlign = "center";

    const world = this.getWorld();

    ctx.fillStyle = world.fillStyle;
    ctx.strokeStyle = world.strokeStyle;
    ctx.lineWidth = 6;
    ctx.strokeText(state.world, Camera.w / 2, 40);
    ctx.fillText(state.world, Camera.w / 2, 40);
    ctx.strokeText(state.area + "", Camera.w / 2, 80);
    ctx.fillText(state.area + "", Camera.w / 2, 80);
    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    const area = this.getArea();
    if (area) {
      let text = area.text ?? "";
      if (area.vp) text += " Reached " + area.vp + " VP";
      ctx.fillStyle = world.fillStyle;
      ctx.strokeStyle = world.strokeStyle;
      ctx.lineWidth = 6;
      ctx.strokeText(text, Camera.w / 2, Camera.h - 120);
      ctx.fillText(text, Camera.w / 2, Camera.h - 120);
    }

    ctx.textAlign = "left";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textAlign = "left";
    ctx.font = '500 20px "Open Sans", sans-serif ';
    ctx.fillText(
      "pps " + webSocketConnection.packagesPerSecond,
      0,
      Camera.h - 40
    );
    ctx.textAlign = "left";
    ctx.fillText("kbps " + webSocketConnection.kBPerSecond, 0, Camera.h - 10);
  }

  private static getWorld() {
    let isContain = Object.keys(useAssetsStore.getState().worlds).includes(
      gameState.world
    );
    let world: RawClient;
    if (!isContain)
      world = {
        fillStyle: "#fff",
        strokeStyle: "#ccc",
        areaFill: "#ccc",
        effect: WorldEffect.Autumn,
      };
    else world = useAssetsStore.getState().worlds[gameState.world].client;
    return world;
  }

  private static getArea() {
    let isContain = Object.keys(useAssetsStore.getState().worlds).includes(
      gameState.world
    );
    if (isContain) {
      const ar = useAssetsStore.getState().worlds[gameState.world].areas;
      if (ar !== undefined && Object.keys(ar).includes(gameState.area + "")) {
        return ar[gameState.area];
      }
    }
    return false;
  }

  private static renderBackground(ctx: CanvasRenderingContext2D) {
    const world = this.getWorld();

    const pos = Camera.transform({
      x: -10 * 32,
      y: 0,
    });
    ctx.globalAlpha = world.areaAlpha ?? 0.3;
    ctx.fillStyle = world.areaFill;
    ctx.fillRect(
      pos.x,
      pos.y,
      (gameState.areaBoundary.w + 20 * 32) * Camera.s,
      gameState.areaBoundary.h * Camera.s
    );
    if (world.backgrounds) {
      for (const texture of world.backgrounds) {
        ctx.globalAlpha = texture[1];

        ctx.drawImage(AssetLoader.images[texture[0]], pos.x, pos.y);
      }
    }
  }

  // private static renderEffect(ctx: CanvasRenderingContext2D, timeFix: number) {
  //   if (this.worldsFromAssets.includes(gameState.world)) {
  //     const world = GlobalAssets.worlds[gameState.world];
  //     if (world.effect) {
  //       let instanceOfEffect;
  //       if (Render.effect === undefined || Render.effect.type != world.effect) {
  //         switch (world.effect) {
  //           default:
  //           case WorldEffect.Rain:
  //             instanceOfEffect = new RainEffect(true);
  //             break;
  //           case WorldEffect.RainStorm:
  //             instanceOfEffect = new RainEffect(true);
  //             break;
  //           case WorldEffect.SnowStorm:
  //             instanceOfEffect = new SnowEffect(false);
  //             break;
  //           case WorldEffect.Snow:
  //             instanceOfEffect = new SnowEffect(true);
  //             break;
  //           case WorldEffect.LeafFall:
  //             instanceOfEffect = new LeafFallEffect();
  //             break;
  //         }

  //         Render.effect = instanceOfEffect;
  //       }

  //       Render.effect.render(ctx, timeFix);
  //     }
  //   }
  // }
}
