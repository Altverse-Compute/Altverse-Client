import Camera from "../storages/camera";
import { GlobalAssets } from "../../assets";
import { game } from "../../proto/generated/js";

export default class Entity {
  harmless: boolean;
  radius: number;
  type: number;
  x: number;
  y: number;
  alpha: number;
  state: number;
  stateMetadata: number;

  constructor(props: game.IPackedEntity) {
    this.x = (props.x ?? 0) / 2;
    this.y = (props.y  ?? 0 ) / 2;
    this.type = props.typeId ?? 0;
    this.radius = (props.radius ?? 0 )/ 2;
    this.harmless = props.harmless ?? false;
    this.alpha = (props.alpha ?? 0) / 20;
    this.state = props.state ?? 0;
    this.stateMetadata = (props.stateMetadata  ?? 0) / 2;
  }

  draw(ctx: CanvasRenderingContext2D, _: number) {
    ctx.beginPath();
    ctx.lineWidth = 2 * Camera.s;
    const ent = GlobalAssets.entities[this.type];
    ctx.fillStyle = (ent ?? ["#fff"])[0];
    ctx.strokeStyle = (ent ?? ["#fff"])[0];
    ctx.globalAlpha = this.alpha !== 1 ? this.alpha : this.harmless ? 0.4 : 1;
    const pos = Camera.transform(this);
    ctx.arc(pos.x, pos.y, this.radius * Camera.s, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#00000077";
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }

  drawaura(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    const ent = GlobalAssets.entities[this.type];
    ctx.fillStyle = (ent ?? ["#fff"])[0];
    ctx.globalAlpha = 0.15;
    if (this.state === 1)
      ctx.arc(
        Camera.w / 2 + (this.x - Camera.x) * Camera.s,
        Camera.h / 2 + (this.y - Camera.y) * Camera.s,
        this.stateMetadata * Camera.s,
        0,
        Math.PI * 2
      );
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
  }

  accept(props: game.IPackedEntity) {
    this.x = props.x ? (props.x / 2): this.x;
    this.y = props.y ? (props.y / 2): this.y;
    this.radius = props.radius ?  (props.radius / 2) : this.radius;
    this.harmless = props.harmless ?? this.harmless;
    this.alpha = props.alpha != null ? props.alpha / 20 : this.alpha;
  }
}
