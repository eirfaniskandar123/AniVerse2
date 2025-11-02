
import { configureStore } from '@reduxjs/toolkit';
import animeReducer from './slices/animeSlice';
import animeDetailReducer from './slices/animeDetailSlice';

export const store = configureStore({
  reducer: {
    anime: animeReducer,
    animeDetail: animeDetailReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
