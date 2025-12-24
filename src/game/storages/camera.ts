import AssetLoader from "./assets";

export default class Camera {
	static x = 0;
	static y = 0;
	static s = 1;

	static w = 1280;
	static h = 720;

	static follow(pos: { x: number; y: number }) {
		this.x = pos.x;
		this.y = pos.y;
		AssetLoader.updateTiles(0, true);
	}

	static transform(pos: { x: number; y: number }): { x: number; y: number } {
		return { x: Camera.w / 2 + (pos.x - Camera.x) * Camera.s, y: Camera.h / 2 + (pos.y - Camera.y) * Camera.s };
	}
}
