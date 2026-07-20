export interface IChat {
	id: bigint;
	content: string;
	author: string;
	world: string;
}
export interface IPackedPlayer {
	id: bigint;
	name: string;
	x: number;
	y: number;
	radius: number;
	speed: number;
	energy: number;
	max_energy: number;
	death_timer: number;
	state: number;
	state_meta: number;
	area: number;
	world: string;
	downed: boolean;
	hero: number;
}
export interface IPartialPlayer {
	id: bigint;
	name?: string;
	x?: number;
	y?: number;
	radius?: number;
	speed?: number;
	energy?: number;
	max_energy?: number;
	death_timer?: number;
	state?: number;
	state_meta?: number;
	area?: number;
	world?: string;
	downed?: boolean;
}
export enum EPartialPlayerBitmask {
	name = 0,
	x = 1,
	y = 2,
	radius = 3,
	speed = 4,
	energy = 5,
	max_energy = 6,
	death_timer = 7,
	state = 8,
	state_meta = 9,
	area = 10,
	world = 11,
	downed = 12,
}
export interface IPackedEntity {
	id: bigint;
	type_id: number;
	x: number;
	y: number;
	radius: number;
	harmless: boolean;
	state: number;
	state_meta: number;
	alpha: number;
}
export interface IPartialEntity {
	id: bigint;
	x?: number;
	y?: number;
	radius?: number;
	harmless?: boolean;
	state?: number;
	state_meta?: number;
	alpha?: number;
}
export enum EPartialEntityBitmask {
	x = 0,
	y = 1,
	radius = 2,
	harmless = 3,
	state = 4,
	state_meta = 5,
	alpha = 6,
}
export interface IPackedArea {
	w: number;
	h: number;
	area: number;
	world: string;
	entities: IPackedEntity[];
}
export interface IPlayers {
	players: IPackedPlayer[];
}
export interface IEntities {
	entities: IPackedEntity[];
}
export interface IClosePlayer {
	id: number;
}
export interface ICloseEntities {
	ids: number[];
}
export interface IUpdateEntities {
	items: IPartialEntity[];
}
export interface IUpdatePlayers {
	items: IPartialPlayer[];
}
export interface IPackage {
	new_player?: IPackedPlayer;
	close_player?: IClosePlayer;
	players?: IPlayers;
	new_entities?: IEntities;
	close_entities?: ICloseEntities;
	area_init?: IPackedArea;
	myself?: IPackedPlayer;
	update_entities?: IUpdateEntities;
	update_players?: IUpdatePlayers;
	chat?: IChat;
}
export enum EPackageBitmask {
	new_player = 0,
	close_player = 1,
	players = 2,
	new_entities = 3,
	close_entities = 4,
	area_init = 5,
	myself = 6,
	update_entities = 7,
	update_players = 8,
	chat = 9,
}
export interface IPackages {
	items: IPackage[];
}

class BufferReader {
  private data: Uint8Array;
  private view: DataView;
  offset: number = 0;

  private static readonly decoder = new TextDecoder();

  constructor(data: Uint8Array) {
    this.data = data;
    this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
  }

  private ensure(bytes: number): void {
    if (this.offset + bytes > this.data.length) {
      throw new RangeError(
        `BufferReader: Attempt read ${bytes} byte outbound of buffer (offset=${this.offset}, length=${this.data.length})`,
      );
    }
  }

  readU8(): number {
    this.ensure(1);
    return this.data[this.offset++];
  }

  readI8(): number {
    this.ensure(1);
    return this.view.getInt8(this.offset++);
  }

  readBool(): boolean {
    return this.readU8() !== 0;
  }

  readU16(): number {
    this.ensure(2);
    const value = this.view.getUint16(this.offset, true);
    this.offset += 2;
    return value;
  }

  readI16(): number {
    this.ensure(2);
    const value = this.view.getInt16(this.offset, true);
    this.offset += 2;
    return value;
  }

  readU32(): number {
    this.ensure(4);
    const value = this.view.getUint32(this.offset, true);
    this.offset += 4;
    return value;
  }

  readI32(): number {
    this.ensure(4);
    const value = this.view.getInt32(this.offset, true);
    this.offset += 4;
    return value;
  }

  readVarU32(): number {
    let x = 0;
    let shift = 0;

    while (true) {
      this.ensure(1);
      const b = this.data[this.offset++];

      x += shift < 28 ? (b & 0xff) << shift : (b & 0xff) * Math.pow(2, shift);

      if ((b & 0x80) === 0) {
        return x;
      }

      shift += 7;

      if (shift > 49) {
        throw new RangeError("BufferReader: could not decode varint");
      }
    }
  }

  readVarI32(): number {
    const encoded = this.readVarU32();
    return (encoded >> 1) ^ (-(encoded & 1));
  }

  readU64(): bigint {
    this.ensure(8);
    const value = this.view.getBigUint64(this.offset, true);
    this.offset += 8;
    return value;
  }

  readI64(): bigint {
    this.ensure(8);
    const value = this.view.getBigInt64(this.offset, true);
    this.offset += 8;
    return value;
  }

  private static halfBitsToFloat(bits: number): number {
    const sign = bits >> 15 ? -1 : 1;
    const exponent = (bits & 0x7c00) >> 10;
    const fraction = bits & 0x03ff;

    if (exponent === 0) {
      return sign * fraction * Math.pow(2, -24);
    }

    if (exponent === 0x1f) {
      return fraction ? NaN : sign * Infinity;
    }

    return sign * (1 + fraction / 1024) * Math.pow(2, exponent - 15);
  }

  readF16(): number {
    const bits = this.readU16();
    return BufferReader.halfBitsToFloat(bits);
  }

  readF32(): number {
    this.ensure(4);
    const value = this.view.getFloat32(this.offset, true);
    this.offset += 4;
    return value;
  }

  readF64(): number {
    this.ensure(8);
    const value = this.view.getFloat64(this.offset, true);
    this.offset += 8;
    return value;
  }

  readChar(): string {
    this.ensure(1);
    const bytes = this.data.subarray(this.offset, this.offset + 1);
    this.offset += 1;
    return BufferReader.decoder.decode(bytes);
  }

  readString(): string {
    const length = this.readVarU32();
    this.ensure(length);
    const bytes = this.data.subarray(this.offset, this.offset + length);
    this.offset += length;
    return BufferReader.decoder.decode(bytes);
  }

  readBytes(length: number): Uint8Array {
    this.ensure(length);
    const bytes = this.data.subarray(this.offset, this.offset + length);
    this.offset += length;
    return bytes;
  }

  get remaining(): number {
    return this.data.length - this.offset;
  }

  get eof(): boolean {
    return this.offset >= this.data.length;
  }
}


class BufferWriter {
  private buffer: ArrayBuffer;
  private data: Uint8Array;
  private view: DataView;
  offset: number = 0;

  private static readonly encoder = new TextEncoder();

  private static readonly f32Scratch = new Float32Array(1);
  private static readonly i32Scratch = new Int32Array(
    BufferWriter.f32Scratch.buffer,
  );

  constructor(initialCapacity: number = 16384) {
    this.buffer = new ArrayBuffer(initialCapacity);
    this.data = new Uint8Array(this.buffer);
    this.view = new DataView(this.buffer);
  }

  private static floatToHalfBits(value: number): number {
    BufferWriter.f32Scratch[0] = value;
    const x = BufferWriter.i32Scratch[0];

    const sign = (x >> 16) & 0x8000;
    let m = (x >> 12) & 0x07ff;
    const e = (x >> 23) & 0xff;

    if (e < 103) {
      return sign;
    }

    if (e > 142) {
      if (e === 255 && x & 0x007fffff) {
        return sign | 0x7c00 | 0x0200;
      }
      return sign | 0x7c00;
    }

    if (e < 113) {
      m |= 0x0800;
      return sign | ((m >> (114 - e)) + ((m >> (113 - e)) & 1));
    }

    let bits = sign | ((e - 112) << 10) | (m >> 1);
    bits += m & 1;
    return bits;
  }

  private ensure(bytes: number): void {
    const required = this.offset + bytes;
    if (required <= this.buffer.byteLength) return;

    let newCapacity = this.buffer.byteLength * 2;
    while (newCapacity < required) newCapacity *= 2;

    const newBuffer = new ArrayBuffer(newCapacity);
    new Uint8Array(newBuffer).set(this.data);

    this.buffer = newBuffer;
    this.data = new Uint8Array(newBuffer);
    this.view = new DataView(newBuffer);
  }

  writeU8(value: number): void {
    this.ensure(1);
    this.data[this.offset++] = value & 0xff;
  }

  writeI8(value: number): void {
    this.ensure(1);
    this.view.setInt8(this.offset, value);
    this.offset += 1;
  }

  writeBool(value: boolean): void {
    this.writeU8(value ? 1 : 0);
  }

  writeU16(value: number): void {
    this.ensure(2);
    this.view.setUint16(this.offset, value, true);
    this.offset += 2;
  }

  writeI16(value: number): void {
    this.ensure(2);
    this.view.setInt16(this.offset, value, true);
    this.offset += 2;
  }

  writeU32(value: number): void {
    this.ensure(4);
    this.view.setUint32(this.offset, value, true);
    this.offset += 4;
  }

  writeI32(value: number): void {
    this.ensure(4);
    this.view.setInt32(this.offset, value, true);
    this.offset += 4;
  }

  writeVarU32(value: number): void {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new RangeError("BufferWriter: could not encode varint");
    }
    if (value >= 2 ** 31) {
      throw new RangeError(
        `BufferWriter: writeVarint do not support >= 2^31 (value = ${value}), choose other method`,
      );
    }

    const REST = 0x7f;
    const MSB = 0x80;
    const MSBALL = ~REST;

    let x = value;

    while (x & MSBALL) {
      this.writeU8((x & REST) | MSB);
      x >>>= 7;
      x -= 1;
    }

    this.writeU8(x & REST);
  }

  writeVarI32(value: number): void {
    if (!Number.isSafeInteger(value)) {
      throw new RangeError("BufferWriter: value must be an integer");
    }
    if (value < -(2 ** 31) || value >= 2 ** 31) {
      throw new RangeError(
        `BufferWriter: value out of 32-bit range (value = ${value})`
      );
    }
    
    const encoded = (value << 1) ^ (value >> 31);
    this.writeVarU32(encoded >>> 0);
  }

  writeU64(value: bigint): void {
    this.ensure(8);
    this.view.setBigUint64(this.offset, value, true);
    this.offset += 8;
  }

  writeI64(value: bigint): void {
    this.ensure(8);
    this.view.setBigInt64(this.offset, value, true);
    this.offset += 8;
  }

  writeF16(value: number): void {
    const bits = BufferWriter.floatToHalfBits(value);
    this.writeU16(bits);
  }

  writeF32(value: number): void {
    this.ensure(4);
    this.view.setFloat32(this.offset, value, true);
    this.offset += 4;
  }

  writeF64(value: number): void {
    this.ensure(8);
    this.view.setFloat64(this.offset, value, true);
    this.offset += 8;
  }

  writeChar(value: string): void {
    if (value.length < 1) 
      throw new RangeError(
        `BufferWriter: writeChar char length is below 1 (value = ${value})`,
      );
    const bytes = BufferWriter.encoder.encode(value);
    this.writeU8(bytes[0]);
  }

  writeString(value: string): void {
    const bytes = BufferWriter.encoder.encode(value);
    this.writeVarU32(bytes.length);
    this.writeBytes(bytes);
  }

  writeBytes(bytes: Uint8Array): void {
    this.ensure(bytes.length);
    this.data.set(bytes, this.offset);
    this.offset += bytes.length;
  }

  toUint8Array(): Uint8Array {
    return this.data.slice(0, this.offset);
  }

  get length(): number {
    return this.offset;
  }
}

class Quantaizer {
  public static fromF32ToQ8(value: number, step: number): number {
    const q = Math.round(value / step);
    return Math.min(127, Math.max(-127, q));
  }

  public static fromF32ToUQ8(value: number, step: number): number {
    const q = Math.round(value / step);
    return Math.min(255, Math.max(0, q));
  }

  public static fromQ8ToF32(quantized: number, step: number): number {
    return quantized * step;
  }

  public static fromF32ToQ16(value: number, step: number): number {
    const q = Math.round(value / step);
    return Math.min(32767, Math.max(-32767, q));
  }

  public static fromF32ToUQ16(value: number, step: number): number {
    const q = Math.round(value / step);
    return Math.min(65536, Math.max(0, q));
  }

  public static fromQ16ToF32(quantized: number, step: number): number {
    return quantized * step;
  }
}
export class Chat {
	public static writePackage(value: IChat, writer: BufferWriter) {
		writer.writeVarU32(1)
		writer.writeVarU32(Number(value["id"]))
		writer.writeString(value["content"])
		writer.writeString(value["author"])
		writer.writeString(value["world"])
	}
	public static readPackage(reader: BufferReader): IChat {
		if (reader.readVarU32() !== 1) throw new Error("Read package type mismatch")
		return {
			id: BigInt(reader.readVarU32()),
			content: reader.readString(),
			author: reader.readString(),
			world: reader.readString(),
		}
	}
	public static fromUint8Array(array: Uint8Array): IChat {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IChat): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class PackedPlayer {
	public static writePackage(value: IPackedPlayer, writer: BufferWriter) {
		writer.writeVarU32(2)
		writer.writeVarU32(Number(value["id"]))
		writer.writeString(value["name"])
		writer.writeF32(value["x"])
		writer.writeF32(value["y"])
		writer.writeF32(value["radius"])
		writer.writeF32(value["speed"])
		writer.writeF32(value["energy"])
		writer.writeF32(value["max_energy"])
		writer.writeF32(value["death_timer"])
		writer.writeU8(value["state"])
		writer.writeF32(value["state_meta"])
		writer.writeVarU32(value["area"])
		writer.writeString(value["world"])
		writer.writeBool(value["downed"])
		writer.writeU32(value["hero"])
	}
	public static readPackage(reader: BufferReader): IPackedPlayer {
		if (reader.readVarU32() !== 2) throw new Error("Read package type mismatch")
		return {
			id: BigInt(reader.readVarU32()),
			name: reader.readString(),
			x: reader.readF32(),
			y: reader.readF32(),
			radius: reader.readF32(),
			speed: reader.readF32(),
			energy: reader.readF32(),
			max_energy: reader.readF32(),
			death_timer: reader.readF32(),
			state: reader.readU8(),
			state_meta: reader.readF32(),
			area: reader.readVarU32(),
			world: reader.readString(),
			downed: reader.readBool(),
			hero: reader.readU32(),
		}
	}
	public static fromUint8Array(array: Uint8Array): IPackedPlayer {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IPackedPlayer): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class PartialPlayer {
	public static writePackage(value: IPartialPlayer, writer: BufferWriter) {
		writer.writeVarU32(3)
		let bitmask = 0
		if (value.name != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.name
		if (value.x != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.x
		if (value.y != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.y
		if (value.radius != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.radius
		if (value.speed != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.speed
		if (value.energy != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.energy
		if (value.max_energy != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.max_energy
		if (value.death_timer != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.death_timer
		if (value.state != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.state
		if (value.state_meta != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.state_meta
		if (value.area != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.area
		if (value.world != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.world
		if (value.downed != undefined)
			bitmask |= 1 << EPartialPlayerBitmask.downed
		writer.writeVarU32(bitmask)
		writer.writeVarU32(Number(value["id"]))
		if (value["name"] != undefined)
			writer.writeString(value["name"])
		if (value["x"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["x"], 0.5))
		if (value["y"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["y"], 0.5))
		if (value["radius"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["radius"], 0.5))
		if (value["speed"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["speed"], 0.5))
		if (value["energy"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["energy"], 0.5))
		if (value["max_energy"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["max_energy"], 0.5))
		if (value["death_timer"] != undefined)
			writer.writeI8(Quantaizer.fromF32ToQ8(value["death_timer"], 0.6))
		if (value["state"] != undefined)
			writer.writeU8(value["state"])
		if (value["state_meta"] != undefined)
			writer.writeF32(value["state_meta"])
		if (value["area"] != undefined)
			writer.writeVarU32(value["area"])
		if (value["world"] != undefined)
			writer.writeString(value["world"])
		if (value["downed"] != undefined)
			writer.writeBool(value["downed"])
	}
	public static readPackage(reader: BufferReader): IPartialPlayer {
		if (reader.readVarU32() !== 3) throw new Error("Read package type mismatch")
		const bitmask = reader.readVarU32()
		return {
			id: BigInt(reader.readVarU32()),
			name: bitmask & 1 << EPartialPlayerBitmask.name ? reader.readString() : undefined,
			x: bitmask & 1 << EPartialPlayerBitmask.x ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			y: bitmask & 1 << EPartialPlayerBitmask.y ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			radius: bitmask & 1 << EPartialPlayerBitmask.radius ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			speed: bitmask & 1 << EPartialPlayerBitmask.speed ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			energy: bitmask & 1 << EPartialPlayerBitmask.energy ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			max_energy: bitmask & 1 << EPartialPlayerBitmask.max_energy ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			death_timer: bitmask & 1 << EPartialPlayerBitmask.death_timer ? Quantaizer.fromQ8ToF32(reader.readI8(), 0.6) : undefined,
			state: bitmask & 1 << EPartialPlayerBitmask.state ? reader.readU8() : undefined,
			state_meta: bitmask & 1 << EPartialPlayerBitmask.state_meta ? reader.readF32() : undefined,
			area: bitmask & 1 << EPartialPlayerBitmask.area ? reader.readVarU32() : undefined,
			world: bitmask & 1 << EPartialPlayerBitmask.world ? reader.readString() : undefined,
			downed: bitmask & 1 << EPartialPlayerBitmask.downed ? reader.readBool() : undefined,
		}
	}
	public static fromUint8Array(array: Uint8Array): IPartialPlayer {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IPartialPlayer): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class PackedEntity {
	public static writePackage(value: IPackedEntity, writer: BufferWriter) {
		writer.writeVarU32(4)
		writer.writeVarU32(Number(value["id"]))
		writer.writeVarU32(value["type_id"])
		writer.writeF32(value["x"])
		writer.writeF32(value["y"])
		writer.writeF32(value["radius"])
		writer.writeBool(value["harmless"])
		writer.writeU8(value["state"])
		writer.writeF32(value["state_meta"])
		writer.writeF32(value["alpha"])
	}
	public static readPackage(reader: BufferReader): IPackedEntity {
		if (reader.readVarU32() !== 4) throw new Error("Read package type mismatch")
		return {
			id: BigInt(reader.readVarU32()),
			type_id: reader.readVarU32(),
			x: reader.readF32(),
			y: reader.readF32(),
			radius: reader.readF32(),
			harmless: reader.readBool(),
			state: reader.readU8(),
			state_meta: reader.readF32(),
			alpha: reader.readF32(),
		}
	}
	public static fromUint8Array(array: Uint8Array): IPackedEntity {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IPackedEntity): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class PartialEntity {
	public static writePackage(value: IPartialEntity, writer: BufferWriter) {
		writer.writeVarU32(5)
		let bitmask = 0
		if (value.x != undefined)
			bitmask |= 1 << EPartialEntityBitmask.x
		if (value.y != undefined)
			bitmask |= 1 << EPartialEntityBitmask.y
		if (value.radius != undefined)
			bitmask |= 1 << EPartialEntityBitmask.radius
		if (value.harmless != undefined)
			bitmask |= 1 << EPartialEntityBitmask.harmless
		if (value.state != undefined)
			bitmask |= 1 << EPartialEntityBitmask.state
		if (value.state_meta != undefined)
			bitmask |= 1 << EPartialEntityBitmask.state_meta
		if (value.alpha != undefined)
			bitmask |= 1 << EPartialEntityBitmask.alpha
		writer.writeVarU32(bitmask)
		writer.writeVarU32(Number(value["id"]))
		if (value["x"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["x"], 0.5))
		if (value["y"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["y"], 0.5))
		if (value["radius"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["radius"], 0.5))
		if (value["harmless"] != undefined)
			writer.writeBool(value["harmless"])
		if (value["state"] != undefined)
			writer.writeU8(value["state"])
		if (value["state_meta"] != undefined)
			writer.writeI16(Quantaizer.fromF32ToQ16(value["state_meta"], 0.5))
		if (value["alpha"] != undefined)
			writer.writeI8(Quantaizer.fromF32ToQ8(value["alpha"], 0.39))
	}
	public static readPackage(reader: BufferReader): IPartialEntity {
		if (reader.readVarU32() !== 5) throw new Error("Read package type mismatch")
		const bitmask = reader.readVarU32()
		return {
			id: BigInt(reader.readVarU32()),
			x: bitmask & 1 << EPartialEntityBitmask.x ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			y: bitmask & 1 << EPartialEntityBitmask.y ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			radius: bitmask & 1 << EPartialEntityBitmask.radius ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			harmless: bitmask & 1 << EPartialEntityBitmask.harmless ? reader.readBool() : undefined,
			state: bitmask & 1 << EPartialEntityBitmask.state ? reader.readU8() : undefined,
			state_meta: bitmask & 1 << EPartialEntityBitmask.state_meta ? Quantaizer.fromQ16ToF32(reader.readI16(), 0.5) : undefined,
			alpha: bitmask & 1 << EPartialEntityBitmask.alpha ? Quantaizer.fromQ8ToF32(reader.readI8(), 0.39) : undefined,
		}
	}
	public static fromUint8Array(array: Uint8Array): IPartialEntity {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IPartialEntity): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class PackedArea {
	public static writePackage(value: IPackedArea, writer: BufferWriter) {
		writer.writeVarU32(6)
		writer.writeI16(Quantaizer.fromF32ToQ16(value["w"], 0.5))
		writer.writeI16(Quantaizer.fromF32ToQ16(value["h"], 0.5))
		writer.writeU32(value["area"])
		writer.writeString(value["world"])
			writer.writeVarU32(value["entities"].length);
			for (let i = 0;i < value["entities"].length; i++) {
				PackedEntity.writePackage(value["entities"][i], writer)
			}
	}
	public static readPackage(reader: BufferReader): IPackedArea {
		if (reader.readVarU32() !== 6) throw new Error("Read package type mismatch")
		return {
			w: Quantaizer.fromQ16ToF32(reader.readI16(), 0.5),
			h: Quantaizer.fromQ16ToF32(reader.readI16(), 0.5),
			area: reader.readU32(),
			world: reader.readString(),
			entities: Array.from({length: reader.readVarU32()}).map(() => PackedEntity.readPackage(reader)),
		}
	}
	public static fromUint8Array(array: Uint8Array): IPackedArea {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IPackedArea): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class Players {
	public static writePackage(value: IPlayers, writer: BufferWriter) {
		writer.writeVarU32(7)
			writer.writeVarU32(value["players"].length);
			for (let i = 0;i < value["players"].length; i++) {
				PackedPlayer.writePackage(value["players"][i], writer)
			}
	}
	public static readPackage(reader: BufferReader): IPlayers {
		if (reader.readVarU32() !== 7) throw new Error("Read package type mismatch")
		return {
			players: Array.from({length: reader.readVarU32()}).map(() => PackedPlayer.readPackage(reader)),
		}
	}
	public static fromUint8Array(array: Uint8Array): IPlayers {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IPlayers): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class Entities {
	public static writePackage(value: IEntities, writer: BufferWriter) {
		writer.writeVarU32(8)
			writer.writeVarU32(value["entities"].length);
			for (let i = 0;i < value["entities"].length; i++) {
				PackedEntity.writePackage(value["entities"][i], writer)
			}
	}
	public static readPackage(reader: BufferReader): IEntities {
		if (reader.readVarU32() !== 8) throw new Error("Read package type mismatch")
		return {
			entities: Array.from({length: reader.readVarU32()}).map(() => PackedEntity.readPackage(reader)),
		}
	}
	public static fromUint8Array(array: Uint8Array): IEntities {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IEntities): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class ClosePlayer {
	public static writePackage(value: IClosePlayer, writer: BufferWriter) {
		writer.writeVarU32(9)
		writer.writeVarU32(value["id"])
	}
	public static readPackage(reader: BufferReader): IClosePlayer {
		if (reader.readVarU32() !== 9) throw new Error("Read package type mismatch")
		return {
			id: reader.readVarU32(),
		}
	}
	public static fromUint8Array(array: Uint8Array): IClosePlayer {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IClosePlayer): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class CloseEntities {
	public static writePackage(value: ICloseEntities, writer: BufferWriter) {
		writer.writeVarU32(10)
			writer.writeVarU32(value["ids"].length);
			for (let i = 0;i < value["ids"].length; i++) {
				writer.writeVarU32(value["ids"][i])
			}
	}
	public static readPackage(reader: BufferReader): ICloseEntities {
		if (reader.readVarU32() !== 10) throw new Error("Read package type mismatch")
		return {
			ids: Array.from({length: reader.readVarU32()}).map(() => reader.readVarU32()),
		}
	}
	public static fromUint8Array(array: Uint8Array): ICloseEntities {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: ICloseEntities): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class UpdateEntities {
	public static writePackage(value: IUpdateEntities, writer: BufferWriter) {
		writer.writeVarU32(11)
			writer.writeVarU32(value["items"].length);
			for (let i = 0;i < value["items"].length; i++) {
				PartialEntity.writePackage(value["items"][i], writer)
			}
	}
	public static readPackage(reader: BufferReader): IUpdateEntities {
		if (reader.readVarU32() !== 11) throw new Error("Read package type mismatch")
		return {
			items: Array.from({length: reader.readVarU32()}).map(() => PartialEntity.readPackage(reader)),
		}
	}
	public static fromUint8Array(array: Uint8Array): IUpdateEntities {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IUpdateEntities): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class UpdatePlayers {
	public static writePackage(value: IUpdatePlayers, writer: BufferWriter) {
		writer.writeVarU32(12)
			writer.writeVarU32(value["items"].length);
			for (let i = 0;i < value["items"].length; i++) {
				PartialPlayer.writePackage(value["items"][i], writer)
			}
	}
	public static readPackage(reader: BufferReader): IUpdatePlayers {
		if (reader.readVarU32() !== 12) throw new Error("Read package type mismatch")
		return {
			items: Array.from({length: reader.readVarU32()}).map(() => PartialPlayer.readPackage(reader)),
		}
	}
	public static fromUint8Array(array: Uint8Array): IUpdatePlayers {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IUpdatePlayers): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class Package {
	public static writePackage(value: IPackage, writer: BufferWriter) {
		writer.writeVarU32(13)
		let bitmask = 0
		if (value.new_player != undefined)
			bitmask |= 1 << EPackageBitmask.new_player
		if (value.close_player != undefined)
			bitmask |= 1 << EPackageBitmask.close_player
		if (value.players != undefined)
			bitmask |= 1 << EPackageBitmask.players
		if (value.new_entities != undefined)
			bitmask |= 1 << EPackageBitmask.new_entities
		if (value.close_entities != undefined)
			bitmask |= 1 << EPackageBitmask.close_entities
		if (value.area_init != undefined)
			bitmask |= 1 << EPackageBitmask.area_init
		if (value.myself != undefined)
			bitmask |= 1 << EPackageBitmask.myself
		if (value.update_entities != undefined)
			bitmask |= 1 << EPackageBitmask.update_entities
		if (value.update_players != undefined)
			bitmask |= 1 << EPackageBitmask.update_players
		if (value.chat != undefined)
			bitmask |= 1 << EPackageBitmask.chat
		writer.writeVarU32(bitmask)
		if (value["new_player"] != undefined)
			PackedPlayer.writePackage(value["new_player"], writer)
		if (value["close_player"] != undefined)
			ClosePlayer.writePackage(value["close_player"], writer)
		if (value["players"] != undefined)
			Players.writePackage(value["players"], writer)
		if (value["new_entities"] != undefined)
			Entities.writePackage(value["new_entities"], writer)
		if (value["close_entities"] != undefined)
			CloseEntities.writePackage(value["close_entities"], writer)
		if (value["area_init"] != undefined)
			PackedArea.writePackage(value["area_init"], writer)
		if (value["myself"] != undefined)
			PackedPlayer.writePackage(value["myself"], writer)
		if (value["update_entities"] != undefined)
			UpdateEntities.writePackage(value["update_entities"], writer)
		if (value["update_players"] != undefined)
			UpdatePlayers.writePackage(value["update_players"], writer)
		if (value["chat"] != undefined)
			Chat.writePackage(value["chat"], writer)
	}
	public static readPackage(reader: BufferReader): IPackage {
		if (reader.readVarU32() !== 13) throw new Error("Read package type mismatch")
		const bitmask = reader.readVarU32()
		return {
			new_player: bitmask & 1 << EPackageBitmask.new_player ? PackedPlayer.readPackage(reader) : undefined,
			close_player: bitmask & 1 << EPackageBitmask.close_player ? ClosePlayer.readPackage(reader) : undefined,
			players: bitmask & 1 << EPackageBitmask.players ? Players.readPackage(reader) : undefined,
			new_entities: bitmask & 1 << EPackageBitmask.new_entities ? Entities.readPackage(reader) : undefined,
			close_entities: bitmask & 1 << EPackageBitmask.close_entities ? CloseEntities.readPackage(reader) : undefined,
			area_init: bitmask & 1 << EPackageBitmask.area_init ? PackedArea.readPackage(reader) : undefined,
			myself: bitmask & 1 << EPackageBitmask.myself ? PackedPlayer.readPackage(reader) : undefined,
			update_entities: bitmask & 1 << EPackageBitmask.update_entities ? UpdateEntities.readPackage(reader) : undefined,
			update_players: bitmask & 1 << EPackageBitmask.update_players ? UpdatePlayers.readPackage(reader) : undefined,
			chat: bitmask & 1 << EPackageBitmask.chat ? Chat.readPackage(reader) : undefined,
		}
	}
	public static fromUint8Array(array: Uint8Array): IPackage {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IPackage): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
export class Packages {
	public static writePackage(value: IPackages, writer: BufferWriter) {
		writer.writeVarU32(14)
			writer.writeVarU32(value["items"].length);
			for (let i = 0;i < value["items"].length; i++) {
				Package.writePackage(value["items"][i], writer)
			}
	}
	public static readPackage(reader: BufferReader): IPackages {
		if (reader.readVarU32() !== 14) throw new Error("Read package type mismatch")
		return {
			items: Array.from({length: reader.readVarU32()}).map(() => Package.readPackage(reader)),
		}
	}
	public static fromUint8Array(array: Uint8Array): IPackages {
		const reader = new BufferReader(array);
		return this.readPackage(reader);
	}
	public static toUint8Array(object: IPackages): Uint8Array {
		const writer = new BufferWriter();
		this.writePackage(object, writer);
		return writer.toUint8Array();
	}
}
