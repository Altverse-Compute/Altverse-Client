export interface Vector {
	x: number;
	y: number;
}

export function distance(circle1: Vector, circle2: Vector) {
	return Math.sqrt((circle1.x - circle2.x) ** 2 + (circle1.y - circle2.y) ** 2);
}
