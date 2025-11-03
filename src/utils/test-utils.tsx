import React, { PropsWithChildren } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import type { AppStore, RootState } from "@/store/store";
import lobbyReducer from "@/store/slices/lobbySlice";

type PreloadedState<T> = Partial<T>;

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: PreloadedState<RootState>;
  store?: AppStore;
}

const DEFAULT_PRELOADED_STATE: PreloadedState<RootState> = {
  lobby: {
    searchTerm: "",
    categories: [],
    games: [],
    selectedCategoryUrl: null,
    pageNumber: 1,
    pageSize: 20,
    isLoading: false,
    hasMore: true,
    error: null,
  },
};


export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = DEFAULT_PRELOADED_STATE,
    store = configureStore({
      reducer: { lobby: lobbyReducer },
      preloadedState: preloadedState as RootState, 
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: PropsWithChildren<object>) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}
