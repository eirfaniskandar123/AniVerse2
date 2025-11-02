import axios from 'axios';
import { Anime, JikanResponse, AnimeRelation } from '../types/jikan';

const apiClient = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
});

interface SearchParams {
  q?: string;
  letter?: string;
  page: number;
  limit: number;
  signal: AbortSignal;
}

interface GetAnimeListParams {
  page: number;
  limit: number;
  signal: AbortSignal;
}


export const searchAnime = async ({ q, letter, page, limit, signal }: SearchParams): Promise<JikanResponse<Anime[]>> => {
  const params: any = { page, limit, sfw: true };
  if (q) {
    params.q = q;
  }
  if (letter) {
    params.letter = letter;
  }
  
  const response = await apiClient.get('/anime', {
    params,
    signal,
  });
  return response.data;
};

export const getAnimeList = async ({ page, limit, signal }: GetAnimeListParams): Promise<JikanResponse<Anime[]>> => {
    const response = await apiClient.get('/anime', {
        params: {
            page,
            limit,
            order_by: 'start_date',
            sort: 'desc',
            sfw: true,
        },
        signal,
    });
    return response.data;
};

export const getAnimeById = async (id: number): Promise<JikanResponse<Anime>> => {
  const response = await apiClient.get(`/anime/${id}/full`);
  return response.data;
};

export const getAnimeRelations = async (id: number): Promise<JikanResponse<AnimeRelation[]>> => {
  const response = await apiClient.get(`/anime/${id}/relations`);
  return response.data;
};

export const getTopAnime = async (limit: number = 5): Promise<JikanResponse<Anime[]>> => {
    const response = await apiClient.get('/top/anime', {
        params: { filter: 'airing', limit, sfw: true }
    });
    return response.data;
}

export const getSeasonNow = async (limit: number = 10): Promise<JikanResponse<Anime[]>> => {
    const response = await apiClient.get('/seasons/now', {
        params: { limit, sfw: true }
    });
    return response.data;
}