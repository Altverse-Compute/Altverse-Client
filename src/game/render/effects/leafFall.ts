import Camera from "../../storages/camera";
import { WorldEffect } from "../../types";

interface Particle {
	x: number;
	y: number;
	r: number;
	xs: number;
	ys: number;
	t: number;
}

function random(min: number, max: number) {
	return Math.random() * (max - min) + min;
}

export class LeafFallEffect {
	type = WorldEffect.LeafFall;
	maxParts = 250;
	particles: Particle[] = [];
	delay = random(300, 500);
	images: Array<HTMLImageElement> = [];
	constructor() {
		this.maxParts = 50;
		for (var a = 0; a < this.maxParts; a++) {
			this.particles.push({
				x: random(0, Camera.w + 250) + Camera.x,
				y: random(0, Camera.h) + Camera.y,
				r: random(20, 40),
				xs: random(-1, 1) - 1,
				ys: random(0.3, 3),
				t: Math.round(Math.random()),
			});
		}
		const list = ["/images/entity/leaf.png", "/images/entity/leaf2.png"];
		for (const i of list) {
			const img = new Image();
			img.src = i;
			this.images.push(img);
		}
	}

	render(ctx: CanvasRenderingContext2D, timeFix: number) {
		for (var b = 0; b < this.particles.length; b++) {
			var p = this.particles[b];

			ctx.save();
			ctx.translate(p.x - Camera.x, p.y - Camera.y);
			const minAngle = Math.PI / 2;
			const maxAngle = (Math.PI * 3) / 2;

			const sway = Math.sin(p.y / 50);
			const t = (sway + 1) / 2;

			const angle = minAngle + t * (maxAngle - minAngle);

			ctx.rotate(angle);
			ctx.globalAlpha = 0.5;
			ctx.drawImage(this.images[p.t], -p.r / 2, -p.r / 2, p.r, p.r);
			ctx.restore();

			p.x += p.xs * timeFix;
			p.y += p.ys * timeFix;

			if (p.y - Camera.y - p.r < 0 || p.y - Camera.y - p.r > Camera.h || p.x - p.r - Camera.x < 0) {
				p.x = random(Camera.w, Camera.w + 250) + Camera.x;
				p.y = random(0, Camera.h) + Camera.y;
			}
		}
	}
}
