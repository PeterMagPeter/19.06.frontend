import { Card, Col, Container, Image, Row } from "react-bootstrap";
import Pic from "../assets/pictures/profile_pic_placeholder.png";
import Header from "../components/Header/Header";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import EditProfile from "./ProfileSettings";
import { deleteLogin } from "../backendAPI/loginAPI";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../components/reducer/TestReducer";


export default function PageProfile() {
  // let nick: string = "Peter";
  let lvl: number = 1;
  let points: number = 0;
  const nick = useSelector((state: any) => state.userReducer.username);

  const [edit, setEdit] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = async ()=>{
    await deleteLogin();
    dispatch(deleteUser());
    navigate("/");
  }

  if (edit) {
    return (
      <>
        <EditProfile />
      </>
    );
  } else {
    return (
      <>
        <Header />
        <br />
        <Container>
          <Card>
            <Card.Body>
              <Row>
                <Col>
                  <img src={Pic} width={"40%"} />
                </Col>
                <Col>
                  <Card.Text>{nick}</Card.Text>
                  <Card.Text>Level {lvl}</Card.Text>
                  <Card.Text>{points} XP</Card.Text>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <Button variant="secondary" onClick={() => setEdit(true)}>
                Settings
              </Button>
              <Button variant="danger" onClick={handleLogout}>Logout</Button>
            </Card.Footer>
          </Card>
        </Container>
      </>
    );
  }
}
