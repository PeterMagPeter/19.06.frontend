import styles from "./GameField.module.css";
import { useEffect, useState, useRef } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logoPic from "../../../assets/pictures/cof_logo.png";
import { ShipTemplate } from "../../reducer/TestReducer";
import smallShip from "../../../assets/pictures/Schiffe/StandardPNG/holes/2.png";
import mediumShip from "../../../assets/pictures/Schiffe/StandardPNG/holes/3.png";
import largeShip from "../../../assets/pictures/Schiffe/StandardPNG/holes/4.png";
import xlargeShip from "../../../assets/pictures/Schiffe/StandardPNG/holes/5.png";
import smallShipR from "../../../assets/pictures/Schiffe/StandardPNG/holes/2r.png";
import mediumShipR from "../../../assets/pictures/Schiffe/StandardPNG/holes/3r.png";
import largeShipR from "../../../assets/pictures/Schiffe/StandardPNG/holes/4r.png";
import xlargeShipR from "../../../assets/pictures/Schiffe/StandardPNG/holes/5r.png";

const server = process.env.REACT_APP_API_SERVER_URL;
const fieldSize = 10;
let hiddenLayout = Array.from({ length: fieldSize }, () =>
  Array(fieldSize).fill(null)
);
const waitingTime: number = 700;
const shootingTimer: number = 600;
const modalTime = 1000;
const afterModalTime: number = 1000;
export default function GameField() {
  console.log(server);
  // Ships
  // const ships: ShipTemplate[] = [
  //   { startX: 2, startY: 0, length: 2, direction: "Y", identifier: "2a" },
  //   { startX: 0, startY: 4, length: 5, direction: "X", identifier: "5" },
  // ];

  // Player
  let username = useSelector((state: any) => state.userReducer.username);
  let ownShips = useSelector((state: any) => state.userReducer.ships);
  let difficulty = useSelector((state: any) => state.userReducer.aiDifficulty);
  let cooldown = useRef<Boolean>(false);
  const [enemyShips, setEnemyShips] = useState<ShipTemplate[]>([]);
  // const [enabledPlayer, setEnabledPlayer] = useState<string>(username);
  let enabledPlayer = useRef<string>(username);
  let nextShooter = useRef<string>(username);
  const [whosTurn, setWhosTurn] = useState<boolean>(false);
  const navigate = useNavigate();
  // Martyna ----------
  type Position = { x: number; y: number };

  function positionToString(position: Position): string {
    return position.x.toString() + position.y.toString();
  }
  // -----------------------------
  // Websocket---------------------
  const [socket, setSocket] = useState<any>();
  useEffect(() => {
    // websocket connects to server
    const newSocket: any = io(`${server}`);
    newSocket.on("connect", () => {
      newSocket.emit("sendShipPlacement", ownShips, username, difficulty);
      // setTimeout(()=> navigate("/timeout"), 150000)
    });

    newSocket.on("hitEvent", (body: any) => {
      setHitEvent(body.x, body.y, body.username, body.hit, body.switchTo);
    });
    newSocket.on("shipDestroyed", (body: ShipTemplate, shooter: string) => {
      // schiff und der der geschossen hat
      setShipDestroyed(body, shooter);
    });
    newSocket.on("gameOver", (body: any) => {
      // bekommt gewinner namen
      if (body.username === username) {
        navigate("/win");
      } else {
        navigate("/loose");
      }
    });

    // need to set the socket at bottom to emit something
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [server]);
  // set backgroundcolor/ classname of button
  const changeColor = (button: HTMLElement, event: string) => {
    if (button) {
      button.classList.forEach((className) =>
        button.classList.remove(className)
      );
      if (event === "Hit") {
        // button.innerHTML = "X";
        button.setAttribute("data-state", "X");
        button.classList.add(styles.Hit);
      } else if (event === "Miss") {
        // button.innerHTML = "O";
        button.setAttribute("data-state", "O");
        button.classList.add(styles.Miss);
      } else if (event === "Destroyed") {
        // button.innerHTML = "";
        button.setAttribute("data-state", "D");
        button.classList.add(styles.Destroyed);
      }
    }
  };
  // Functions that the Player sends
  function sendShot(position: Position) {
    let id = positionToString(position);
    const button = document.getElementById(id);
    let newX = position.x;
    let body = { x: newX, y: position.y, username: username };
    // console.log(body, " sendShot body")
    if (button && button.getAttribute("data-state") === "")
      if (socket) {
        socket.emit("sendShot", body);
      }
  }
  // Funktionen die Websocket aufruft------------
  // Websocket ruft auf und setzt das Feld auf die passende Farbe.
  function setHitEvent(
    x: number,
    y: number,
    shooter: string,
    hit: boolean,
    switchTo: string
  ) {
    let position = { x: x, y: y };
    let id = positionToString(position);
    if (username !== shooter) id = id + "E";
    const button = document.getElementById(id);
    // console.log(id, hit, username, shooter);
    let booli = hit ? "Hit" : "Miss";
    if (button) {
      changeColor(button, booli);
    }
    console.log("setHit", switchTo, enabledPlayer.current);
    nextShooter.current = switchTo;
    cooldown.current = true;
    setTimeout(() => {
      cooldown.current = false;
      if (switchTo !== enabledPlayer.current) {
        // setEnabledPlayer(switchTo);
        changeEnabledPlayer(switchTo);
      }
    }, shootingTimer);
  }
  // Websocket setzt ein Schiff auf zerstört und es wird damit sichtbar
  function setShipDestroyed(ship: ShipTemplate, shooter: string) {
    console.log(JSON.stringify(ship), " shooter: ", shooter);
    let positions: Position[] = [{ x: 0, y: 0 }];
    for (let i = 0; i < ship.length; i++) {
      positions[i] =
        ship.direction === "X"
          ? { x: ship.startX + i, y: ship.startY }
          : { x: ship.startX, y: ship.startY + i };
    }
    positions.forEach((position) => {
      let id = positionToString(position);
      if (username !== shooter) id = id + "E";
      const button = document.getElementById(id);
      if (button) {
        changeColor(button, "Destroyed");
      }
    });
    if (shooter === username)
      setEnemyShips((prevShips) => [...prevShips, ship]);
  }

  const generateShips = (ships: ShipTemplate[]) => {
    const divs = [];
    // Generate own ships
    for (let i = 0; i < ships.length; i++) {
      let s = ships[i];
      let startRow = s.startX + 2;
      let startColumn = s.startY + 2;
      let endColumn, endRow;
      let shipImage = smallShip;

      if (s.direction === "X") {
        endRow = startRow + s.length;
        endColumn = startColumn;
        switch (s.length) {
          case 2:
            shipImage = smallShip;
            break;
          case 3:
            shipImage = mediumShip;
            break;
          case 4:
            shipImage = largeShip;
            break;
          case 5:
            shipImage = xlargeShip;
            break;
          default:
            break;
        }
      } else {
        endRow = startRow;
        endColumn = startColumn + s.length;
        switch (s.length) {
          case 2:
            shipImage = smallShipR;
            break;
          case 3:
            shipImage = mediumShipR;
            break;
          case 4:
            shipImage = largeShipR;
            break;
          case 5:
            shipImage = xlargeShipR;
            break;
          default:
            break;
        }
      }
      divs.push(
        <div
          style={{
            gridColumn: `${startRow} / ${endRow}`,
            gridRow: `${startColumn} / ${endColumn}`,
          }}
          className={styles.miniContainer}
          key={i}
        >
          <Image className={styles.miniImagesW} src={shipImage} />
        </div>
      );
    }
    return divs;
  };

  const whichTurn: boolean = username === enabledPlayer.current;

  const changeEnabledPlayer = (switchTo: string) => {
    // shows whos turn it is as Modal
    console.log(switchTo, enabledPlayer.current);
    showWhosTurn();
    setTimeout(() => {
      enabledPlayer.current = switchTo;
    }, afterModalTime);

    cooldown.current = false;
  };
  const showWhosTurn = () => {
    setWhosTurn(true);
    setTimeout(() => {
      setWhosTurn(false);
    }, modalTime);
  };
  const addEnemyShip = () => {
    setEnemyShips((prevShips) => [...prevShips, ownShips[enemyShips.length]]);
    console.log(enemyShips);
  };

  return (
    <>
      <div className={styles.container}>
        <Image className={styles.Logo} src={logoPic} />
        <div className={styles.whosTurn}> <a className={styles.playerName}>{enabledPlayer.current}</a>'s TURN</div>
        {/* GAME FIELD WHERE PLAYER IS PLAYING */}
        <div className={whichTurn ? styles.GameField : styles.Ownboard}>
          {generateShips(enemyShips)}
          {Array.from({ length: fieldSize }, (_, index) => {
            let letter = String.fromCharCode("A".charCodeAt(0) + index);
            let letter2 = whichTurn ? letter : letter + "E";
            return (
              <div className={styles[letter2]}>
                <p>{letter}</p>
              </div>
            );
          })}
          {Array.from({ length: fieldSize }, (_, index) => {
            let num = index + 1;
            let s = whichTurn ? "" : "E";
            let num2 = "N" + num + s;
            return (
              <div className={styles[num2]}>
                <p>{index + 1}</p>
              </div>
            );
          })}
          {hiddenLayout.map((row, rowIndex) => {
            let letter = String.fromCharCode("A".charCodeAt(0) + rowIndex);
            return row.map((item, itemIndex) => {
              let s = whichTurn ? "" : "E";
              let coordinate = letter + (itemIndex + 1) + s;
              let id = positionToString({ x: rowIndex, y: itemIndex });
              const button = document.getElementById(id);
              let newButton = styles.button;
              if (button) {
                newButton =
                  button.getAttribute("data-state") === "X"
                    ? styles.Hit
                    : button.getAttribute("data-state") === "D"
                    ? styles.Destroyed
                    : button.getAttribute("data-state") === "O"
                    ? styles.Miss
                    : styles.button;
              }
              return (
                <div className={styles[coordinate]}>
                  <button
                    data-state=""
                    className={newButton}
                    id={positionToString({
                      x: rowIndex,
                      y: itemIndex,
                    })}
                    onClick={() => {
                      if (whichTurn && !cooldown.current) {
                        sendShot({
                          x: rowIndex,
                          y: itemIndex,
                        });
                      }
                    }}
                  ></button>
                </div>
              );
            });
          })}
        </div>
        {/* OWN BOARD WHERE ENEMY IS PLAYING */}
        <div className={!whichTurn ? styles.GameField : styles.Ownboard}>
          {generateShips(ownShips)}

          {Array.from({ length: fieldSize }, (_, index) => {
            let letter = String.fromCharCode("A".charCodeAt(0) + index);
            let letter2 = !whichTurn ? letter : letter + "E";
            return <div className={styles[letter2]}>{letter}</div>;
          })}
          {Array.from({ length: fieldSize }, (_, index) => {
            let num = index + 1;
            let s = !whichTurn ? "" : "E";
            let num2 = "N" + num + s;
            return <div className={styles[num2]}>{index + 1}</div>;
          })}
          {hiddenLayout.map((row, rowIndex) => {
            let letter = String.fromCharCode("A".charCodeAt(0) + rowIndex);
            return row.map((item, itemIndex) => {
              let s = !whichTurn ? "" : "E";
              let coordinate = letter + (itemIndex + 1) + s;

              let id = positionToString({ x: rowIndex, y: itemIndex }) + "E";
              const button = document.getElementById(id);
              let newButton = styles.button;
              if (button) {
                newButton =
                  button.getAttribute("data-state") === "X"
                    ? styles.Hit
                    : button.getAttribute("data-state") === "D"
                    ? styles.Destroyed
                    : button.getAttribute("data-state") === "O"
                    ? styles.Miss
                    : styles.buttonE;
              }
              return (
                <div className={styles[coordinate]}>
                  <button
                    data-state=""
                    className={newButton}
                    id={
                      positionToString({
                        x: rowIndex,
                        y: itemIndex,
                      }) + "E"
                    }
                  ></button>
                </div>
              );
            });
          })}
        </div>
        <Button
          className={styles.Emotes}
          // onClick={() => changeEnabledPlayer("ki")}
          variant="secondary"
        >
          {" "}
          Emotes
        </Button>
        {/* <Button onClick={addEnemyShip}> add enemy ship Destroyed</Button> */}
        <Modal
          show={whosTurn}
          onHide={() => setWhosTurn(false)}
          backdrop="static"
          keyboard={false}
          centered
          animation={true}
          className="blur-background"
        >
          <Modal.Title className={styles.modalText}>
            {nextShooter.current} ist jetzt dran
          </Modal.Title>
        </Modal>
      </div>
    </>
  );
}
