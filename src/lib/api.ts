
import {
  ConfigResponse,
  FetchGamesParams,
  RawCategoryGamesResponse,
  RawSearchGamesResponse,
  TransformedGamesResponse,
  ApiGame,
  Game,
} from './types';

const BASE_URL = "https://casino.api.pikakasino.com/v1/pika";
const ABORT_TIMEOUT = 5000;

async function serverFetch<T>(endpoint: string, params?: Record<string, unknown>): Promise<T> {
  const qs = params ? new URLSearchParams(
    Object.keys(params).reduce((acc, key) => {
      if (params[key] !== undefined && params[key] !== null) {
        acc[key] = params[key];
      }
      return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, {} as Record<string, any>)
  ).toString() : "";
  
  const url = `${BASE_URL}${endpoint}${qs ? `?${qs}` : ""}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_TIMEOUT);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Cache-Control": "no-store" },
      cache: "no-store",
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      console.error(`API Error: ${res.status} at ${url}`);
      throw new Error(`Request failed with status ${res.status}`);
    }
    return res.json() as T;
  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`Server fetch failed: ${err}`);
    throw err;
  }
}

export async function fetchCategories() {
  return serverFetch<ConfigResponse>('/en/config');
}

export async function fetchInitialGames(categoryFetchUrl: string) {
  return fetchGames({
    fetchUrl: categoryFetchUrl,
    pageNumber: 1,
    pageSize: 20,
  });
}

function transformApiGame(apiGame: ApiGame): Game {
  const thumbnailUrl = apiGame.image?.thumbnail?.src;
  
  return {
    id: apiGame.id,
    name: apiGame.gameText,
    thumbnail: thumbnailUrl,
  };
}

export async function fetchGames(
  params: FetchGamesParams
): Promise<TransformedGamesResponse> {
  
  let url: string;

  if (params.search) {
    url = `${BASE_URL}/en/games/tiles`;
  } else if (params.fetchUrl) {
    url = params.fetchUrl;
  } else {
    console.warn("fetchGames called without search or fetchUrl");
    return { games: [], totalGames: 0 };
  }

  const queryParams = new URLSearchParams();
  queryParams.set('pageNumber', String(params.pageNumber));
  queryParams.set('pageSize', String(params.pageSize));

  if (params.search) {
    queryParams.set('search', params.search);
  }

  const finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryParams.toString()}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ABORT_TIMEOUT);

  try {
    const res = await fetch(finalUrl, {
      signal: controller.signal,
      cache: 'no-store',
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Request failed: ${res.status} ${finalUrl}`);
    }

    const rawData = await res.json();

    if (rawData.items && typeof rawData.count === 'number') {
      const searchData = rawData as RawSearchGamesResponse;
      const cleanGames = searchData.items.map(transformApiGame);
      return {
        games: cleanGames,
        totalGames: searchData.count,
      };
    }
    
    if (rawData.components) {
      const categoryData = rawData as RawCategoryGamesResponse;
      const gameListComponent = categoryData.components.find(
        (c) => c.type === 'game-list'
      );

      if (!gameListComponent || !gameListComponent.games) {
        return { games: [], totalGames: 0 };
      }

      const cleanGames = gameListComponent.games.map(transformApiGame);
      return {
        games: cleanGames,
        totalGames: gameListComponent.total,
      };
    }

    console.error("Unknown API response structure:", rawData);
    return { games: [], totalGames: 0 };

  } catch (err) {
    clearTimeout(timeoutId);
    console.error(`FetchGames Error: ${err}`);
    throw err;
  }
}