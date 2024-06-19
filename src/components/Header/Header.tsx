import styles  from "./Header.module.css";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "../ErrorFallback";
import {
  Image,
  Col,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Row,
  Stack,
} from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Home from "../../assets/pictures/cof_logo_vert.png";
import Pic from "../../assets/pictures/profile_pic_placeholder.png"
import { Button } from "react-bootstrap";
import { useState } from "react";
import { useSelector } from "react-redux";
import { deleteLogin } from "../../backendAPI/loginAPI";
import { useDispatch } from "react-redux";
import { deleteUser } from "../reducer/TestReducer";
import { useNavigate } from "react-router-dom";


export default function Header() {
  let loggedIn = useSelector((state: any) => state.userReducer.loggedIn);
  let nick = useSelector((state: any) => state.userReducer.username);

  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async ()=>{
    await deleteLogin();
    dispatch(deleteUser());
    navigate("/");
  }

  return (
    <Navbar className="bg-body-tertiary" data-bs-theme="dark">
      <Stack direction="horizontal" gap={3} className={styles.headerStack}>
        <div>
          <LinkContainer to="/oc">
            <Image src={Home} width={"250px"} />
          </LinkContainer>
        </div>
        <div className={styles.msAuto}>
          <Row>
            <Col>
              <LinkContainer to="/profile">
                <Image src={Pic} width={"40px"} />
              </LinkContainer>
            </Col>
            <Col>
              <Nav>
                <NavDropdown
                  className="align-items-center"
                  title={loggedIn ? nick : "Menu"}
                >
                  {loggedIn && (
                    <NavDropdown.Item>Profile settings</NavDropdown.Item>
                  )}
                  {soundOn ? (
                    <Button onClick={() => setSoundOn(false)} variant="light">Sound off</Button>
                  ) : (
                    <Button onClick={() => setSoundOn(true)} variant="light">Sound on</Button>
                  )}
                  {musicOn ? (
                    <Button onClick={() => setMusicOn(false)} variant="light">Music off</Button>
                  ) : (
                    <Button onClick={() => setMusicOn(true)} variant="light">Music on</Button>
                  )}
                  {loggedIn ? (
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                  ) : (
                    <NavDropdown.Item href="/">Login</NavDropdown.Item>
                  )}
                </NavDropdown>
              </Nav>
            </Col>
          </Row>
        </div>
      </Stack>
    </Navbar>
  );
}