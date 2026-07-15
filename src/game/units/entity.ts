import Camera from "../storages/camera";
import { GlobalAssets } from "../../assets";
import * as game from "@proto/game_pb";
import type { AltverseServer } from "@proto/game";
import type { DecodedPartialEntity } from "../types";

export default class Entity {
  harmless: boolean;
  radius: number;
  type: number;
  x: number;
  y: number;
  alpha: number;
  state: number;
  stateMetadata: number;

  constructor(props: AltverseServer.PackedEntity) {
    this.x = props.x();
    this.y = props.y();
    this.type = Number(props.typeId());
    this.radius = props.radius();
    this.harmless = props.harmless();
    this.alpha = props.alpha();
    this.state = props.state();
    this.stateMetadata = props.stateMetadata();
  }

  draw(ctx: CanvasRenderingContext2D, _: number) {
    ctx.beginPath();
    ctx.lineWidth = 2 * Camera.s;
    const ent = GlobalAssets.entities[this.type];
    ctx.fillStyle = (ent ?? ["#fff"])[0];
    ctx.strokeStyle = (ent ?? ["#fff"])[0];
    ctx.globalAlpha = this.alpha < 1 ? this.alpha : this.harmless ? 0.4 : 1;
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
        Math.PI * 2,
      );
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.closePath();
  }

  accept(props: DecodedPartialEntity) {
    this.x = props.x ? props.x : this.x;
    this.y = props.y ? props.y : this.y;
    this.radius = props.radius ? props.radius : this.radius;
    this.harmless = props.harmless ?? this.harmless;
    this.alpha = props.alpha != null ? props.alpha : this.alpha;
  }
}
