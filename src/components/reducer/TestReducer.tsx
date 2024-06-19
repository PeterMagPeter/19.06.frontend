import { createSlice } from "@reduxjs/toolkit";
export interface ShipTemplate {
  identifier: string;
  direction: "X" | "Y";
  startX: number;
  startY: number;
  length: number;
}
interface User {
  token: string;
  loggedIn: boolean;
  username: string;
  email: string
  ships: ShipTemplate[];
  aiDifficulty: number;
}

// Initialer Zustand des Reducers
const initialState: User = {
  token: "",
  loggedIn: false,
  username: "",
  email: "",
  ships: [],
  aiDifficulty: 0.5
};

// Erstelle ein Slice mit einem Reducer und Aktionen
const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    deleteUser: (state) => {
      state.token = "";
      state.username = "";
      state.loggedIn = false;
      state.email="";
      console.log("user gelöscht: ");
    },
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.loggedIn = action.payload.loggedIn;
      state.username = action.payload.username;
      state.email = action.payload.email;

      console.log("in setUser für " + JSON.stringify(state.username));
      console.log(" - token:  " + JSON.stringify(state.token));
      console.log(" - loggedIn:  " + JSON.stringify(state.loggedIn));
    },
    setShips: (state, action) => {
      state.ships = action.payload.ships
    },
    setAiDifficulty: (state, action)=> {
      state.aiDifficulty = action.payload.aiDifficulty
    },
  },
});

// Exportiere Reducer und Aktionen
export const { deleteUser, setUser, setShips, setAiDifficulty } = userReducer.actions;
export default userReducer.reducer;
