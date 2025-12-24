import { useLeaderBoard } from "../../../hooks/leaderboard";
import styles from "./index.module.css";

export function LeaderBoard() {
  const { worldList, style } = useLeaderBoard();

  return (
    <div className={styles.leaderboard} style={style}>
      <span className={styles.leaderboardTitle}>Leaderboard</span>
      {worldList.map((world, i) => (
        <div key={i}>
          <div className={styles.leaderboardTitleBreak}>
            <span style={{ color: world.color }}>{world.name}</span>
          </div>
          {world.players.map((player, i) => (
            <div className={styles.leaderboardLine} key={i}>
              {player.self ? (
                <b
                  style={{ color: player.died ? "red" : world.color }}
                  v-if="p.self"
                >
                  {player.name}[{player.area}]
                  {player.died && <label>• {player.timer}</label>}
                </b>
              ) : (
                <span style={{ color: player.died ? "red" : world.color }}>
                  {player.name}[{player.area}]
                  {player.died && <label>• {player.timer}</label>}
                </span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
