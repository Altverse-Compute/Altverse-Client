import { useGame } from "../../hooks/game";
import { Chat } from "./chat";
import { Close } from "./close";
import style from "./index.module.css";
import { LeaderBoard } from "./leaderboard";

export function Game() {
  const [canvasRef, reason] = useGame();

  return (
    <div className={style.game}>
      <canvas width={1280} height={720} ref={canvasRef}></canvas>
      <LeaderBoard></LeaderBoard>
      <Chat></Chat>
      <Close reason={reason ?? ""} />
    </div>
  );
}
