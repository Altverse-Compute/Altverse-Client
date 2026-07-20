import AssetLoader from "../../storages/assets.ts";
import Camera from "../../storages/camera.ts";
import Entity from "../../units/entity.ts";

const arr = [AssetLoader.images.leaf, AssetLoader.images.leaf2];

export class StormCloud extends Entity {
  leafImage: HTMLImageElement = arr[Math.round(Math.random())];

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.globalAlpha = this.alpha;
    const pos = Camera.transform(this);
    const size = this.radius * 2 * Camera.s;

    ctx.drawImage(
      this.leafImage,
      pos.x - size / 2,
      pos.y - size / 2,
      size,
      size,
    );
    ctx.globalAlpha = 1;
    ctx.closePath();
  }
}
