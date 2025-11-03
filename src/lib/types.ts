export interface Game {
  id: string;
  name: string;
  thumbnail: string;
  original: string;
}

export interface TransformedGamesResponse {
  games: Game[];
  totalGames: number;
}

export interface ApiGame {
  id: string;
  gameText: string;
  image: {
    thumbnail: {
      src: string;
    };
    original: {
      src: string;
    }
  };
}

export interface RawCategoryGamesResponse {
  components: {
    type: string;
    games: ApiGame[];
    total: number;
  }[];
}

export interface RawSearchGamesResponse {
  items: ApiGame[];
  count: number;
}

export interface ApiGameListComponent {
  type: string;
  games: ApiGame[];
  total: number;
}

export interface RawGamesApiResponse {
  components: ApiGameListComponent[];
}

export interface Category {
  id: string;
  name: string;
  links: {
    getPage: string;
  };
}

export interface ConfigResponse {
  menu: {
    lobby: {
      items: Category[];
    };
    liveLobby: {
      items: Category[];
    };
  };
}

export interface GamesTilesResponse {
  games: Game[];
  totalGames: number;
}


export interface FetchGamesParams {
  fetchUrl?: string;
  search?: string;
  pageNumber: number;
  pageSize: number;
}