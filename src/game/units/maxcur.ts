export default class MaxContainer {
	cur: number;
	max: number;

	constructor(cur: number, max: number) {
		this.cur = cur  / 2;
		this.max = max  / 2;
	}

	accept(cur?: number, max?: number) {
		this.cur = cur ? cur / 2 : this.cur ;
		this.max = max ? max / 2 : this.max;
	}
}
