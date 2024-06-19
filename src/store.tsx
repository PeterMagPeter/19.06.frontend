import { configureStore } from '@reduxjs/toolkit';
import userReducer from './components/reducer/TestReducer';


const store = configureStore({
  reducer: {
    // Weitere Slices können hier hinzugefügt werden
    userReducer: userReducer
  },
});

export type RootState = ReturnType<typeof store.getState>
export default store;
