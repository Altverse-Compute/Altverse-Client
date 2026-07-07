import type { AltverseServer } from "@proto/game";
import Camera from "../storages/camera";
import MaxContainer from "./maxcur";

export abstract class Player {
  x: number;
  y: number;
  id: number;
  name: string;
  area: number;
  world: string;
  speed: MaxContainer;
  regen: MaxContainer;
  radius: number;
  energy: MaxContainer;

  died: undefined | boolean;
  /**
   * Died Timer
   */
  dt: number;

  state: number;
  stateMeta: number;
  hero: number;

  abstract color: string;

  constructor(props: AltverseServer.PackedPlayer) {
    this.x = props.x();
    this.y = props.y();
    this.dt = props.deathTimer();
    this.id = Number(props.id());
    this.name = props.name() ?? "";
    this.area = Number(props.area());
    this.died = props.died();
    this.world = props.world() ?? "";
    this.regen = new MaxContainer(1, 7);
    this.speed = new MaxContainer(props.speed(), 17);
    this.energy = new MaxContainer(props.energy(), props.maxEnergy() ?? 0);
    this.radius = props.radius();
    this.state = props.state();
    this.stateMeta = props.stateMeta();
    this.hero = props.hero();
  }

  draw(ctx: CanvasRenderingContext2D, sid: number) {
    let pos: { x: number; y: number };
    ctx.globalAlpha = 1;
    if (sid === this.id)
      pos = {
        x: Camera.w / 2 + (Camera.x - this.x) * Camera.s,
        y: Camera.h / 2 + (Camera.y - this.y) * Camera.s,
      };
    else
      pos = {
        x: Camera.w / 2 - (Camera.x - this.x) * Camera.s,
        y: Camera.h / 2 - (Camera.y - this.y) * Camera.s,
      };

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.globalAlpha = 1;

    if (this.died) {
      ctx.globalAlpha = 0.2;
    }
    ctx.arc(
      Camera.w / 2 + (this.x - Camera.x) * Camera.s,
      Camera.h / 2 + (this.y - Camera.y) * Camera.s,
      this.radius * Camera.s,
      0,
      Math.PI * 2,
    );
    ctx.fill();
    if (this.died) {
      ctx.fillStyle = "red";
      ctx.globalAlpha = 1;
      ctx.font = 14 * Camera.s + 'px "Open  Sans", Verdana, Segoe, sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(this.dt + "", pos.x, pos.y + 14 / 2);
    }
    ctx.closePath();

    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#0000FF";
    ctx.fillRect(
      pos.x - 18 * Camera.s,
      pos.y - (this.radius + 8) * Camera.s,
      36 * (this.energy.cur / this.energy.max) * Camera.s,
      7 * Camera.s,
    );
    ctx.strokeStyle = "rgb(68, 118, 225)";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      pos.x - 18 * Camera.s,
      pos.y - (this.radius + 8) * Camera.s,
      36 * Camera.s,
      7 * Camera.s,
    );
    ctx.closePath();

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = 12 * Camera.s + 'px "Open  Sans", Verdana, Segoe, sans-serif';
    ctx.fillText(this.name, pos.x, pos.y - (this.radius + 11) * Camera.s);
    ctx.closePath();

    this.renderMeta(ctx, pos);
  }

  abstract renderMeta(
    ctx: CanvasRenderingContext2D,
    renderPos: { x: number; y: number },
  ): void;

  accept(props: AltverseServer.PartialPlayer) {
    if (props == null) return;
    const x = props.x();
    const y = props.y();
    const world = props.world();
    const area = props.area();
    const speed = props.speed();
    const energy = props.energy();
    const maxEnergy = props.maxEnergy();
    const deathTimer = props.deathTimer();
    const died = props.died();
    const state = props.state();
    const stateMeta = props.stateMetadata();
    this.x = x ? x : this.x;
    this.y = y ? y : this.y;
    this.world = world ?? this.world;
    this.area = area ? Number(area) : this.area;
    this.speed.accept(speed ?? 0);
    this.energy.accept(energy ?? 0, maxEnergy ?? 0);
    this.dt = deathTimer ? Math.floor(deathTimer) : this.dt;
    this.died = died !== null ? died : this.died;
    this.state = state ?? this.state;
    this.stateMeta = stateMeta ? stateMeta : this.stateMeta;
  }
}
