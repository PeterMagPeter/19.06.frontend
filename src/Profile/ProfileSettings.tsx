import { Button, Container, Form } from "react-bootstrap";
import Header from "../components/Header/Header";
import { useState } from "react";
import { UserResource } from "../Resources";
import { putUser } from "../backendAPI/userAPI";
import Pic from "../assets/pictures/profile_pic_placeholder.png";
import { useSelector } from "react-redux";
/**
 *
 * Add: settings route for browser navigation
 */
export default function EditProfile() {
  const nick = useSelector((state: any) => state.userReducer.username);
  const email = useSelector((state: any) => state.userReducer.email);

  let user: UserResource = {
    email: email,
    username: nick,
    password: "secure1",
  };
  const [userData, setUserData] = useState<UserResource>(user);

  const [edit, setEdit] = useState<string>("");

  async function updateUser() {
    const updatedUser = await putUser(user);
    setUserData(updatedUser);
  }
  return (
    <>
      <Header />
      <br />
      <Container>
        <Form>
          <img
            src={Pic}
            onClick={() => (edit == "" ? setEdit("picClick") : setEdit(""))}
            width={"30%"}
          />
          <br />
          {edit == "picClick" && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setEdit("pic")}
            >
              Change
            </Button>
          )}
          {edit == "pic" && (
            <>
              <Form.Control type="file"></Form.Control>
              <br />
              <Button
                onClick={() => updateUser()}
                size="sm"
                variant="secondary"
              >
                Save
              </Button>
              <Button onClick={() => setEdit("")} size="sm" variant="dark">
                Cancel
              </Button>
            </>
          )}
          <hr />
          <Form.Label>
            <b>E-mail: </b>
            {user.email}
          </Form.Label>
          <br />
          {edit == "email" ? (
            <>
              <Form.Control
                type="email"
                placeholder="Change e-mail adress"
              ></Form.Control>

              <Button
                onClick={() => {
                  updateUser();
                  setEdit("");
                }}
                variant="secondary"
              >
                Save changes
              </Button>
              <Button onClick={() => setEdit("")} variant="dark">
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEdit("email")}
              size="sm"
              variant="secondary"
            >
              Change e-mail adress
            </Button>
          )}
          <hr />
          {edit == "password" ? (
            <>
              <Form.Control
                type="password"
                placeholder="Old password"
              ></Form.Control>
              <br />
              <Form.Control
                type="password"
                placeholder="New password"
              ></Form.Control>
              <br />
              <Form.Control
                type="password"
                placeholder="Confirm new password"
              ></Form.Control>
              <br />
              <Button
                onClick={() => {
                  updateUser();
                  setEdit("");
                }}
                variant="secondary"
              >
                Save changes
              </Button>
              <Button onClick={() => setEdit("")} variant="dark">
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setEdit("password")}
              size="sm"
              variant="secondary"
            >
              Change account password
            </Button>
          )}
        </Form>
      </Container>
    </>
  );
}
