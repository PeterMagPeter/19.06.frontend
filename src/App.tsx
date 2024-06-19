// import './App.css';

import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignIn from "./components/Login/SignIn";
import PageProfile from "./Profile/PageProfile";
import PageMain from "./components/MainPage/PageMain";
import Registration from "./components/Registration/Registration";
import GamePrototype from "./components/Game/Protoype/GamePrototype";
// import GamePrototype from "./components/Game/Protoype/test";
import GameField from "./components/Game/Gamefield/GameField";
import { Winner } from "./components/Game/Gameend/Winner";
import { Loser } from "./components/Game/Gameend/Loser";
import { Timeout } from "./components/Game/Gameend/Timeout";
function App() {
  const loggedIn = useSelector((state: any) => state.userReducer.loggedIn);
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Router>
          <Routes>
            {loggedIn ? (
              <>
                <Route path="/" element={<PageMain />} />
                <Route path="/shipplacement" element={<GamePrototype />} />
                <Route path="/game" element={<GameField />} />
                <Route path="/profile" element={<PageProfile />} />
                <Route path="/timeout" element={<Timeout />} />
                <Route path="/win" element={<Winner />} />
                <Route path="/loose" element={<Loser />} />
              </>
            ) : (
              <>
                <Route path="/" element={<SignIn />} />
                <Route path="/registration" element={<Registration />} />
              </>
            )}
          </Routes>
        </Router>
      </ErrorBoundary>
    </>
  );
}

export default App;
