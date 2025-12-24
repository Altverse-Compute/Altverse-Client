import Camera from "../../storages/camera";
import { WorldEffect } from "../../types";

interface Particle {
  x: number;
  y: number;
  l: number;
  xs: number;
  ys: number;
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export class RainEffect {
  type: WorldEffect;
  maxParts = 250;
  particles: Particle[] = [];
  delay = random(300, 500);
  light: boolean;
  constructor(light: boolean) {
    this.light = light;
    this.type = light ? WorldEffect.Rain : WorldEffect.RainStorm;
    for (var a = 0; a < this.maxParts; a++) {
      this.particles.push({
        x: random(0, Camera.w) - 10,
        y: random(0, Camera.h) - 10,
        l: random(0.5, 2.5),
        xs: random(0, 1) - 5,
        ys: random(0.3, 3) + 6,
      });
    }
  }

  render(ctx: CanvasRenderingContext2D, timeFix: number) {
    for (var b = 0; b < this.particles.length; b++) {
      var p = this.particles[b];

      ctx.beginPath();
      ctx.strokeStyle = this.light
        ? "rgba(40,37,88,0.9)"
        : "rgba(40,37,88,0.6)";
      ctx.moveTo(p.x - Camera.x, p.y - Camera.y);
      ctx.lineTo(p.x + p.l * p.xs - Camera.x, p.y + p.l * p.ys - Camera.y);
      ctx.stroke();
      ctx.closePath();

      p.x += p.xs * timeFix;
      p.y += p.ys * timeFix;
      if (p.x > Camera.w + 800 + Camera.x || p.y > Camera.h + Camera.y) {
        p.x = random(0, Camera.w + 800) + Camera.x;
        p.y = random(-100, 0) + Camera.y;
      }
    }
    ctx.fillStyle = this.light ? "rgba(80,80,80,0.15)" : "rgba(80,80,80,0.38)";
    ctx.fillRect(0, 0, Camera.w, Camera.h);
    if (!this.light) {
      this.delay--;
      if (this.delay < 0) {
        ctx.fillStyle = "rgba(255,255,255,0.6)";
        ctx.fillRect(0, 0, Camera.w, Camera.h);
        this.delay = random(800, 1500);
      }
    }
  }
}
