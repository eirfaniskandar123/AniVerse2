import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAnimeById, getAnimeRelations } from '../../services/jikanService';
import { Anime, AnimeRelation } from '../../types/jikan';

interface AnimeDetailState {
  anime: Anime | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  relations: AnimeRelation[];
  relationsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: AnimeDetailState = {
  anime: null,
  status: 'idle',
  error: null,
  relations: [],
  relationsStatus: 'idle',
};

export const fetchAnimeById = createAsyncThunk<Anime, number, { rejectValue: string }>(
  'animeDetail/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAnimeById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAnimeRelations = createAsyncThunk<AnimeRelation[], number, { rejectValue: string }>(
  'animeDetail/fetchRelations',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getAnimeRelations(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const animeDetailSlice = createSlice({
  name: 'animeDetail',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeById.pending, (state) => {
        state.status = 'loading';
        state.anime = null;
        state.relations = [];
        state.relationsStatus = 'idle';
      })
      .addCase(fetchAnimeById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.anime = action.payload;
      })
      .addCase(fetchAnimeById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Failed to fetch anime details';
      })
      .addCase(fetchAnimeRelations.pending, (state) => {
        state.relationsStatus = 'loading';
      })
      .addCase(fetchAnimeRelations.fulfilled, (state, action) => {
        state.relationsStatus = 'succeeded';
        state.relations = action.payload;
      })
      .addCase(fetchAnimeRelations.rejected, (state) => {
        state.relationsStatus = 'failed';
      });
  },
});

export default animeDetailSlice.reducer;
