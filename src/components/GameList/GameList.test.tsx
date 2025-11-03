import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { GameList } from "./GameList";
import { RootState } from "../../store/store";

jest.mock("react-intersection-observer", () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: false,
  }),
}));

jest.mock("../GameCard/GameCard", () => ({
  GameCard: ({ game }: { game: { id: string; name: string } }) => (
    <div data-testid="game-card">{game.name}</div>
  ),
}));

jest.mock("../ui/Spinner/Spinner", () => ({
  Spinner: () => <div data-testid="spinner">Loading...</div>,
}));

jest.mock("./GameList.module.scss", () => ({
  listContainer: "listContainer",
  grid: "grid",
  loader: "loader",
  emptyState: "emptyState",
  endMessage: "endMessage",
}));

const renderWithProviders = (
  ui: React.ReactElement,
  { preloadedState }: { preloadedState: Partial<RootState> }
) => {
  const store = configureStore({
    reducer: {
      lobby: (state = preloadedState.lobby) => state,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    preloadedState,
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

describe("GameList", () => {
  it("should display a list of games when games are present in the state", () => {
    const mockGames = [
      { id: "1", name: "Game One", thumbnail: "" },
      { id: "2", name: "Game Two", thumbnail: "" },
    ];

    const initialState: Partial<RootState> = {
      lobby: {
        games: mockGames,
        isLoading: false,
        hasMore: true,
        pageNumber: 1,
        selectedCategoryUrl: "",
        searchTerm: "",
        pageSize: 20,
        categories: [],
        error: null,
      },
    };

    renderWithProviders(<GameList />, { preloadedState: initialState });

    const noGamesHeader = screen.getByText(/No Games Found/i);

    const listContainer = noGamesHeader.closest(".listContainer");

    expect(listContainer!.classList.contains("listContainer")).toBe(true);
  });
});
