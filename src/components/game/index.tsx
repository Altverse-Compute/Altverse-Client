import { useGame } from "../../hooks/game";
import { Chat } from "./chat";
import { Close } from "./close";
import style from "./index.module.css";
import { LeaderBoard } from "./leaderboard";

interface Props {
  ip: string;
}

export function Game(props: Props) {
  const [canvasRef, reason] = useGame(props.ip);

  return (
    <div className={style.game}>
      <canvas width={1280} height={720} ref={canvasRef}></canvas>
      <LeaderBoard></LeaderBoard>
      <Chat></Chat>
      <Close reason={reason ?? ""} />
    </div>
  );
}
