import { decompress } from "lz4js";

export class Compress {
  static  decode(uint8: Uint8Array) {
    return decompress(uint8);
  }
}
