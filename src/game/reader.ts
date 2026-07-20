export class PackageReader {
  data: Uint8Array;
  offset: number = 0;
  constructor(data: Uint8Array) {
    this.data = data;
  }

  readU8(): number {
    return this.data[this.offset++];
  }

  readBool(): boolean {
    return this.data[this.offset++] != 0;
  }

  readU16(): number {
    const value = this.data[this.offset] | (this.data[this.offset + 1] << 8);

    this.offset += 2;
    return value;
  }

  readI16(): number {
    const view = new DataView(
      this.data.buffer,
      this.data.byteOffset + this.offset,
      2,
    );

    const value = view.getInt16(0, true);
    this.offset += 2;

    return value;
  }

  readU32(): number {
    const value =
      this.data[this.offset] |
      (this.data[this.offset + 1] << 8) |
      (this.data[this.offset + 2] << 16) |
      (this.data[this.offset + 3] << 24);

    this.offset += 4;
    return value >>> 0;
  }

  readVarU32(): number {
    let value = 0;
    let shift = 0;

    while (true) {
      const byte = this.readU8();

      value |= (byte & 0x7f) << shift;

      if ((byte & 0x80) === 0) {
        return value >>> 0;
      }

      shift += 7;

      if (shift > 35) {
        throw new Error("Invalid VarInt");
      }
    }
  }

  readU64(): bigint {
    const view = new DataView(
      this.data.buffer,
      this.data.byteOffset + this.offset,
      8,
    );

    const value = view.getBigUint64(0, true);
    this.offset += 8;

    return value;
  }
  readF32(): number {
    const view = new DataView(
      this.data.buffer,
      this.data.byteOffset + this.offset,
      4,
    );

    const value = view.getFloat32(0, true);
    this.offset += 4;

    return value;
  }

  readString(): string {
    const length = this.readVarU32();

    const bytes = this.data.subarray(this.offset, this.offset + length);

    this.offset += length;

    return new TextDecoder().decode(bytes);
  }
}
