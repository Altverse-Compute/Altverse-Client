import { Maven } from "./render/hero/maven";
import Entity from "./units/entity";
import { Leaf } from "./render/entities/leaf";
import type { IPackedEntity, IPackedPlayer } from "./pulse";

// type PlayerConstructor = new (props: PackedPlayer) => Player;
//
// const heroes: Record<number, PlayerConstructor> = {
//   0: Maven,
// };

const entities: Record<number, typeof Entity> = {
  8: Leaf,
};

export class Spawn {
  static player(pkg: IPackedPlayer) {
    // const hero = heroes[pkg.hero];
    // const player = new hero(pkg);
    return new Maven(pkg);
  }
  static entity(pkg: IPackedEntity) {
    const ent = entities[Number(pkg.type_id)];
    if (ent) return new ent(pkg);
    return new Entity(pkg);
  }
}
