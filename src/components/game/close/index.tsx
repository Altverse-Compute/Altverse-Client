import { Link } from "wouter";
import { useGameStore } from "../../../stores/game";

export const Close = (props: { reason: string }) => {
  const game = useGameStore();
  if (props.reason.length !== 0)
    return (
      <div
        className={
          "absolute flex justify-center w-screen min-h-screen bg-[#222] items-center flex-col gap-1"
        }
      >
        <h1 className={"text-5xl"}>{props.reason}</h1>
        <Link
          href={"/"}
          className={"text-2xl bg-(--window-bg) rounded-xl p-1 "}
          onClick={() => {
            game.clear();
          }}
        >
          To home page
        </Link>
      </div>
    );
  return <></>;
};
