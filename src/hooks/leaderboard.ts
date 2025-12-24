import { useState, useEffect } from "preact/hooks";
import { useGameStore } from "../stores/game";
import { useResize } from "../stores/resize";
import { useAssetsStore } from "../stores/assets";

interface PlayerInLeaderBoard {
  area: number;
  name: string;
  died: boolean;
  timer: number;
  self: boolean;
}

interface OutObject {
  name: string;
  color: string;
  players: Array<PlayerInLeaderBoard>;
}

export function useLeaderBoard() {
  const { players, selfId } = useGameStore();
  const resize = useResize();

  const [worldList, setWorldList] = useState<Array<OutObject>>([]);

  const sortPlayers = () => {
    let a = Object.values(players ?? []).sort((v1, v2) => {
      return (
        (v1.world === players[selfId].world
          ? v2.world === players[selfId].world
            ? v2.area - v1.area
            : -1
          : v2.world === players[selfId].world
          ? v1.world === players[selfId].world
            ? v2.area - v1.area
            : 1
          : 0) ||
        (v1.world === v2.world ? 0 : v1.world > v2.world ? 1 : -1) ||
        v2.area - v1.area
      );
    });
    return a;
  };

  const make = () => {
    let outObject: Array<OutObject> = [];
    sortPlayers().forEach((element) => {
      let color;
      if (useAssetsStore.getState().worlds[element.world])
        color =
          useAssetsStore.getState().worlds[element.world].client.fillStyle;
      else color = "#336655";

      let playersTo: PlayerInLeaderBoard = {
        area: element.area,
        name: element.name,
        died: element.died ?? false,
        timer: element.dt ?? -1,
        self: element === players[selfId],
      };
      let tryFind = outObject.find((v) => v.name === element.world);
      if (tryFind) {
        tryFind.players.push(playersTo);
      } else {
        outObject.push({
          name: element.world,
          color: color,
          players: [playersTo],
        });
      }
    });
    return outObject;
  };

  useEffect(() => {
    setWorldList(make());
  }, [players]);

  const style = {
    transform: `scale(${resize.scale})`,
    right: resize.canvasLeft + 10 + "px",
    top: resize.canvasTop + 10 + "px",
    transformOrigin: "100% 0%",
  };

  return { worldList, style };
}
