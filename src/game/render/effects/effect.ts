import type { WorldEffect } from "../../types";

export interface Effect {
	type: WorldEffect;
	render: (ctx: CanvasRenderingContext2D, timeFix: number) => void;
}
