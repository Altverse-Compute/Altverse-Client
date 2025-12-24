import { GlobalAssets } from "../../assets";
import Camera from "./camera";

export default class AssetLoader {
  static tiles: Record<string, CanvasPattern> = {};
  static images: Record<keyof typeof GlobalAssets.textures, HTMLImageElement> =
    {};

  static {
    const tiles = new Image();
    tiles.src = "/images/tiles/tiles.png";
    tiles.onload = () => (this.tiles = this.preparationTiles(tiles));
    this.loadTextures();
  }

  static preparationTiles(image: HTMLImageElement): {
    [key: string]: CanvasPattern;
  } {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    const ctx: CanvasRenderingContext2D = canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    const map: Array<[number, number, number, number, string]> = [
      [384, 0, 128, 128, "teleport_world"],
      [256, 0, 128, 128, "teleport"],
      [256, 0, 128, 128, "victory"],
      [0, 0, 128, 128, "active"],
      [128, 0, 128, 128, "safe"],
      [512, 0, 128, 128, "exit"],
    ];

    const outMassive: { [key: string]: CanvasPattern } = {};

    for (const i in map) {
      const element = map[i];

      canvas.width = element[2];
      canvas.height = element[3];

      ctx.filter = "none";
      ctx.drawImage(
        image,
        element[0],
        element[1],
        element[2],
        element[3],
        0,
        0,
        element[2],
        element[3]
      );
      outMassive[element[4]] = ctx.createPattern(
        canvas,
        "repeat"
      ) as CanvasPattern;
    }

    return outMassive;
  }

  static updateTiles(_: number, tiles: boolean) {
    if (tiles) {
      const t = this.tiles;
      switch (Camera.s) {
        default:
          for (const tid in t) {
            const tile = t[tid];
            tile.setTransform({
              a: Camera.s,
              d: Camera.s,
              e: 1280 / 2 - Camera.x * Camera.s,
              f: 720 / 2 - Camera.y * Camera.s,
            });
            t[tid] = tile;
          }
          this.tiles = t;
          break;
      }
    }
  }

  static loadTextures() {
    for (const i in GlobalAssets.textures) {
      const image = new Image();
      image.src = "/images/" + GlobalAssets.textures[i];
      this.images[i] = image;
    }
  }
}
