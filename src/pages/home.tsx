import { useEffect, useState } from "preact/hooks";
import { Game } from "../components/game";
import { useGameStore } from "../stores/game";
import { useAssetsStore } from "../stores/assets";
import { Sidebar } from "../components/sidebar";
import { ServerList } from "../components/serverlist";
import { Header } from "../components/header.tsx";

export const Home = () => {
  const [inGame, setInGame] = useState(false);
  const game = useGameStore();
  const assets = useAssetsStore();

  useEffect(() => {
    useAssetsStore.getState().fetch();
    if (!inGame) setInGame(game.isGameInit && assets.loaded);
  }, [game.isGameInit, assets.loaded]);

  if (inGame) {
    return <Game />;
  }

  return (
    <>
      <main
        className={
          "min-h-screen w-full flex flex-row gap-1 text-center text-2xl"
        }
      >
        <Sidebar />
        <Header />
        <div
          className={"w-full flex flex-col gap-1 justify-center items-center "}
        >
          <div> </div>
          <h1>Server list</h1>
          <ServerList
            onSelect={() => {
              setInGame(true);
            }}
          />
        </div>
      </main>
    </>
  );
};
