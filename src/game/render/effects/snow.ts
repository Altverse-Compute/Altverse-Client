import Camera from "../../storages/camera";
import { WorldEffect } from "../../types";

interface Particle {
	x: number;
	y: number;
	r: number;
	xs: number;
	ys: number;
}

function random(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export class SnowEffect {
	type: WorldEffect;
	maxParts = 250;
	particles: Particle[] = [];
	delay = random(300, 500);
	light: boolean;
	constructor(light: boolean) {
		this.light = light;
		this.type = light ? WorldEffect.Snow : WorldEffect.SnowStorm;
		this.maxParts = light ? 250 : 350;
		for (var a = 0; a < this.maxParts; a++) {
			this.particles.push({
				x: random(0, Camera.w + 250) + Camera.x,
				y: random(0, Camera.h) + Camera.y,
				r: random(1.5, 3),
				xs: light ? random(3, 6) : random(9, 12),
				ys: light ? random(-3, 3) : random(-3, 3),
			});
		}
	}

	render(ctx: CanvasRenderingContext2D, timeFix: number) {
		for (var b = 0; b < this.particles.length; b++) {
			var p = this.particles[b];

			ctx.beginPath();
			ctx.fillStyle = "rgba(255,255,255,0.6)";
			ctx.arc(p.x - Camera.x, p.y - Camera.y, p.r * Camera.s, 0, Math.PI * 2);
			ctx.fill();
			ctx.closePath();

			p.x -= p.xs * timeFix;
			p.y += p.ys * timeFix;

			if (p.y - Camera.y < 0 || p.y - Camera.y > Camera.h || p.x - Camera.x < 0) {
				p.x = random(Camera.w, Camera.w + 250) + Camera.x;
				p.y = random(0, Camera.h) + Camera.y;
			}
		}
		if (!this.light) {
			ctx.fillStyle = "rgba(255,255,255,0.15)";
			ctx.fillRect(0, 0, Camera.w, Camera.h);
		}
	}
}
