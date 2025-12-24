import AssetLoader from "../../storages/assets";
import Camera from "../../storages/camera";
import Entity from "../../units/entity";
import { game } from "../../../proto/generated/js";

const arr = [AssetLoader.images.leaf, AssetLoader.images.leaf2];

export class Leaf extends Entity {
  leafImage: HTMLImageElement;

  constructor(props: game.PackedEntity) {
    super(props);
    this.leafImage = arr[Math.round(Math.random())];
  }

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
      size
    );
    ctx.globalAlpha = 1;
    ctx.closePath();
  }
}
