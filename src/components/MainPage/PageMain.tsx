import { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import Header from "../Header/Header";
import styles from "./PageMain.module.css";
import { useNavigate } from "react-router-dom";

export default function PageMain() {
  const navigate = useNavigate();

  const [leaderboard] = useState([
    { username: "FastFox", userId: 129, country: "Germany", points: 5434 },
    { username: "RedSun", userId: 512, country: "Japan", points: 5146 },
    { username: "BluSky", userId: 501, country: "Italy", points: 4968 },
    { username: "SnowWolf", userId: 672, country: "Austria", points: 4921 },
    { username: "GreenLeaf", userId: 786, country: "Germany", points: 4864 },
    { username: "IronMite", userId: 588, country: "UK", points: 4827 },
    { username: "IceFang", userId: 807, country: "Germany", points: 4801 },
  ]);

  return (
    <>
      <Header />
      <div className={styles.mainPage}>
        <Container className={styles.mainContent}>
          <Row className="justify-content-center align-items-center h-100">
            <Col md={6} className="text-center">
              <Container className={`d-grid gap-2 ${styles.buttonsContainer}`}>
                <Button
                  onClick={() => navigate("/shipplacement")}
                  variant="secondary"
                  size="lg"
                  className={styles.customButton}
                >
                  Offline-Modus
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  className={styles.customButton}
                >
                  Online-Modus
                </Button>
              </Container>
            </Col>
            <Col md={4} className="d-flex flex-column align-items-center">
              <div className={styles.ranking}>
                <h2>General</h2>
                <p>#2134</p>
                <p>Ranking 248</p>
                <table className={styles.rankingTable}>
                  <thead>
                    <tr>
                      <th>username</th>
                      <th>user id</th>
                      <th>country</th>
                      <th>points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, index) => (
                      <tr key={index}>
                        <td>{entry.username}</td>
                        <td>{entry.userId}</td>
                        <td>{entry.country}</td>
                        <td>{entry.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
