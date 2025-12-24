import { Maven } from "./render/hero/maven";
import Entity from "./units/entity";
import { Leaf } from "./render/entities/leaf";
import { game } from "../proto/generated/js";

// type PlayerConstructor = new (props: PackedPlayer) => Player;
//
// const heroes: Record<number, PlayerConstructor> = {
//   0: Maven,
// };

const entities: Record<number, typeof Entity> = {
  8: Leaf,
};

export class Spawn {
  static player(pkg: game.IPackedPlayer) {
    // const hero = heroes[pkg.hero];
    // const player = new hero(pkg);
    return new Maven(pkg);
  }
  static entity(pkg: game.IPackedEntity) {
    const ent = entities[pkg.typeId ?? 0];
    if (ent) return new ent(pkg);
    return new Entity(pkg);
  }
}
