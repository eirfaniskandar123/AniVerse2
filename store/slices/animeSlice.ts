import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { searchAnime, getTopAnime, getSeasonNow, getAnimeList } from '../../services/jikanService';
import { Anime, Pagination, JikanResponse } from '../../types/jikan';

interface AnimeState {
  searchResults: Anime[];
  previewResults: Anime[];
  latestAnime: Anime[];
  bannerAnime: Anime | null;
  allAnime: Anime[];
  allAnimePagination: Pagination | null;
  pagination: Pagination | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  previewStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  latestStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  allAnimeStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AnimeState = {
  searchResults: [],
  previewResults: [],
  latestAnime: [],
  bannerAnime: null,
  allAnime: [],
  allAnimePagination: null,
  pagination: null,
  status: 'idle',
  previewStatus: 'idle',
  latestStatus: 'idle',
  allAnimeStatus: 'idle',
  error: null,
};

interface FetchAnimeSearchArgs {
  query?: string;
  letter?: string;
  page: number;
  limit?: number;
}

export const fetchAnimeSearch = createAsyncThunk<JikanResponse<Anime[]>, FetchAnimeSearchArgs, { rejectValue: string, signal: AbortSignal }>(
  'anime/fetchSearch',
  async ({ query, letter, page, limit = 12 }, { rejectWithValue, signal }) => {
    try {
      const response = await searchAnime({ q: query, letter, page, limit, signal });
      return response;
    } catch (error: any) {
      if (error.name === 'CanceledError') {
        return rejectWithValue('Request canceled');
      }
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNewestAnime = createAsyncThunk<JikanResponse<Anime[]>, { page: number; limit?: number }, { rejectValue: string, signal: AbortSignal }>(
    'anime/fetchNewest',
    async ({ page, limit = 25 }, { rejectWithValue, signal }) => {
        try {
            const response = await getAnimeList({ page, limit, signal });
            return response;
        } catch (error: any) {
            if (error.name === 'CanceledError') {
                return rejectWithValue('Request canceled');
            }
            return rejectWithValue(error.message);
        }
    }
);

export const fetchTopAnime = createAsyncThunk(
    'anime/fetchTop',
    async (_, { rejectWithValue }) => {
        try {
            const response = await getTopAnime(5);
            const seasonNowResponse = await getSeasonNow(1);
            return { top: response.data, banner: seasonNowResponse.data[0] || null };
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.pagination = null;
      state.status = 'idle';
    },
    clearAllAnime: (state) => {
        state.allAnime = [];
        state.allAnimePagination = null;
    },
    clearPreviewResults: (state) => {
        state.previewResults = [];
        state.previewStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnimeSearch.pending, (state, action) => {
        const isPreview = action.meta.arg.limit && action.meta.arg.limit < 12;
        if (isPreview) {
          state.previewStatus = 'loading';
        } else {
          state.status = 'loading';
        }
      })
      .addCase(fetchAnimeSearch.fulfilled, (state, action) => {
        const isPreview = action.meta.arg.limit && action.meta.arg.limit < 12;
        if(isPreview){
            state.previewResults = action.payload.data;
            state.previewStatus = 'succeeded';
        } else {
            state.searchResults = action.payload.data;
            state.pagination = action.payload.pagination ?? null;
            state.status = 'succeeded';
        }
      })
      .addCase(fetchAnimeSearch.rejected, (state, action) => {
        const isPreview = action.meta.arg.limit && action.meta.arg.limit < 12;
        if (action.payload !== 'Request canceled') {
            if (isPreview) {
              state.previewStatus = 'failed';
            } else {
              state.status = 'failed';
              state.error = action.payload ?? 'Failed to fetch anime';
            }
        } else {
             if (isPreview) {
              state.previewStatus = 'idle';
            } else {
              state.status = 'idle';
            }
        }
      })
      .addCase(fetchTopAnime.pending, (state) => {
          state.latestStatus = 'loading';
      })
      .addCase(fetchTopAnime.fulfilled, (state, action) => {
          state.latestAnime = action.payload.top;
          state.bannerAnime = action.payload.banner;
          state.latestStatus = 'succeeded';
      })
      .addCase(fetchTopAnime.rejected, (state, action) => {
          state.latestStatus = 'failed';
          state.error = action.payload as string;
      })
      .addCase(fetchNewestAnime.pending, (state) => {
          state.allAnimeStatus = 'loading';
      })
      .addCase(fetchNewestAnime.fulfilled, (state, action) => {
          const uniqueAnime = new Map<string, Anime>();
          action.payload.data.forEach(anime => {
              const normalizedTitle = anime.title.replace(/ (Season \d+|Part \d+|2nd Season|3rd Season|\dth Season|Cour \d+)/i, '').trim();
              if (!uniqueAnime.has(normalizedTitle)) {
                  uniqueAnime.set(normalizedTitle, anime);
              }
          });
          
          state.allAnime = Array.from(uniqueAnime.values()).slice(0, 12);
          state.allAnimePagination = action.payload.pagination ?? null;
          state.allAnimeStatus = 'succeeded';
      })
      .addCase(fetchNewestAnime.rejected, (state, action) => {
          if (action.payload !== 'Request canceled') {
              state.allAnimeStatus = 'failed';
              state.error = action.payload ?? 'Failed to fetch newest anime';
          } else {
              state.allAnimeStatus = 'idle';
          }
      });
  },
});

export const { clearSearchResults, clearPreviewResults, clearAllAnime } = animeSlice.actions;
export default animeSlice.reducer;