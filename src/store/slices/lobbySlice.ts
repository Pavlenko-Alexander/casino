import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Game, Category, FetchGamesParams } from "@/lib/types";
import { fetchGames } from "@/lib/api";

interface LobbyState {
  categories: Category[];
  games: Game[];
  selectedCategoryUrl: string | null;
  searchTerm: string;
  pageNumber: number;
  pageSize: number;
  isLoading: boolean;
  hasMore: boolean;
  error: string | null;
}

const initialState: LobbyState = {
  categories: [],
  games: [],
  selectedCategoryUrl: null,
  searchTerm: "",
  pageNumber: 1,
  pageSize: 20,
  isLoading: false,
  hasMore: true,
  error: null,
};

export const getGames = createAsyncThunk(
  "lobby/getGames",
  async (
    params: Omit<FetchGamesParams, "fetchUrl"> & {
      selectedCategoryUrl: string | null;
    },
    { rejectWithValue }
  ) => {
    try {
      const fetchParams: FetchGamesParams = {
        fetchUrl: params.search
          ? undefined
          : params.selectedCategoryUrl || undefined,
        search: params.search || undefined,
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
      };
      const response = await fetchGames(fetchParams);
      return response;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const lobbySlice = createSlice({
  name: "lobby",
  initialState,
  reducers: {
    setInitialData: (
      state,
      action: PayloadAction<{ categories: Category[]; initialGames: Game[] }>
    ) => {
      state.categories = action.payload.categories;
      state.games = action.payload.initialGames;
      state.selectedCategoryUrl =
        action.payload.categories[0]?.links.getPage || null;
      state.pageNumber = 1;
      state.hasMore = action.payload.initialGames.length === state.pageSize;
      state.isLoading = false;
    },

    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategoryUrl = action.payload;
      state.searchTerm = "";
      state.pageNumber = 1;
      state.games = [];
      state.hasMore = true;
      state.error = null;
    },

    setSearch: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.selectedCategoryUrl = null;
      state.pageNumber = 1;
      state.games = [];
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getGames.fulfilled, (state, action) => {
        state.isLoading = false;

        if (state.pageNumber === 1) {
          state.games = action.payload.games;
        } else {
          state.games.push(...action.payload.games);
        }
        state.hasMore = state.games.length < action.payload.totalGames;
        state.pageNumber = state.pageNumber + 1;
      })
      .addCase(getGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setInitialData, setCategory, setSearch } = lobbySlice.actions;
export const lobbyInitialState = lobbySlice.getInitialState();

export default lobbySlice.reducer;
