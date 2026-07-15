import { PackageReader } from "./reader";
import {
  EntityBitMask,
  PlayerBitMask,
  type DecodedPartialEntity,
  type DecodedPartialPlayer,
} from "./types";

export class PackageReaderWrapper {
  reader: PackageReader;
  constructor(data: Uint8Array) {
    this.reader = new PackageReader(data);
  }

  readPlayer(mask: number): DecodedPartialPlayer {
    const pkg: DecodedPartialPlayer = {};

    if (mask & (1 << PlayerBitMask.Pos)) {
      pkg.x = this.reader.readI16() / 2;
      pkg.y = this.reader.readI16() / 2;
    }
    if (mask & (1 << PlayerBitMask.Radius)) {
      pkg.radius = this.reader.readU16() / 2;
    }
    if (mask & (1 << PlayerBitMask.Speed)) {
      pkg.speed = this.reader.readU16() / 2;
    }
    if (mask & (1 << PlayerBitMask.Energy)) {
      pkg.energy = this.reader.readU16() / 2;
    }
    if (mask & (1 << PlayerBitMask.MaxEnergy)) {
      pkg.maxEnergy = this.reader.readU16() / 2;
    }
    if (mask & (1 << PlayerBitMask.DeathTimer)) {
      pkg.deathTimer = this.reader.readU16() / 2;
    }
    if (mask & (1 << PlayerBitMask.State)) {
      pkg.state = this.reader.readU8();
    }
    if (mask & (1 << PlayerBitMask.StateMetadata)) {
      pkg.stateMetadata = this.reader.readU16() / 2;
    }
    if (mask & (1 << PlayerBitMask.Area)) {
      pkg.stateMetadata = Number(this.reader.readU64());
    }
    if (mask & (1 << PlayerBitMask.World)) {
      pkg.world = this.reader.readString();
    }
    if (mask & (1 << PlayerBitMask.Died)) {
      pkg.died = this.reader.readBool();
    }

    return pkg;
  }

  readEntity(mask: number): DecodedPartialEntity {
    const pkg: DecodedPartialEntity = {};

    if (mask & (1 << EntityBitMask.Pos)) {
      pkg.x = this.reader.readI16() / 2;
      pkg.y = this.reader.readI16() / 2;
    }
    if (mask & (1 << EntityBitMask.Radius)) {
      pkg.radius = this.reader.readU16() / 2;
    }
    if (mask & (1 << EntityBitMask.Harmless)) {
      pkg.harmless = this.reader.readBool();
    }
    if (mask & (1 << EntityBitMask.State)) {
      pkg.state = this.reader.readU8();
    }
    if (mask & (1 << EntityBitMask.StateMetadata)) {
      pkg.stateMetadata = this.reader.readU16() / 2;
    }
    if (mask & (1 << EntityBitMask.Alpha)) {
      pkg.alpha = this.reader.readU8() / 255;
    }

    return pkg;
  }
}
