import styles from "./Winner.module.css";
import firework from "../../../assets/Gifs/firework.webp";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
export function Winner() {
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.main}>
        <div className={styles.firework}>
          <img src={firework}></img>
        </div>
        <div className={styles.texts}>
          <h1>You won!</h1>
          <h2>And defeated the AI God himself...</h2>
          <h3>Congratulations, Master!</h3>
          <Button onClick={() => navigate("/")}>zurück zum Hauptmenü</Button>

        </div>
      </div>
    </>
  );
}
