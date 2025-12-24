import { Player } from "../../units/player";

export class Maven extends Player {
  color = "#E6024F";

  renderMeta(
    ctx: CanvasRenderingContext2D,
    renderPos: { x: number; y: number }
  ) {
    if (this.state === 1) {
      ctx.beginPath();
      ctx.globalAlpha = 0.2;
      ctx.arc(renderPos.x, renderPos.y, 180, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.closePath();
    }
    if (this.state === 2) {
      ctx.beginPath();
      ctx.globalAlpha = 0.2;
      ctx.fillStyle = "#000";
      ctx.arc(renderPos.x, renderPos.y, 120, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }
  }
}
