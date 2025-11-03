import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { SearchBar } from "./SearchBar";
import { RootState } from "../../store/store";
import lobbyReducer from "../../store/slices/lobbySlice";
import { describe, expect, it } from "@jest/globals";

jest.mock("./SearchBar.module.scss", () => ({
  searchContainer: "searchContainer",
  searchInput: "searchInput",
  searchIcon: "searchIcon",
}));

const renderWithProviders = (
  ui: React.ReactElement,
  { preloadedState }: { preloadedState: Partial<RootState> }
) => {
  const store = configureStore({
    reducer: {
      lobby: lobbyReducer,
    },
    preloadedState: preloadedState as RootState,
  });

  return render(<Provider store={store}>{ui}</Provider>);
};

describe("SearchBar", () => {
  it("should render the search input with the correct placeholder", () => {
    const initialState: Partial<RootState> = {
      lobby: {
        games: [],
        isLoading: false,
        hasMore: true,
        pageNumber: 1,
        selectedCategoryUrl: null,
        searchTerm: "",
        pageSize: 20,
        categories: [],
        error: null,
      },
    };
    renderWithProviders(<SearchBar />, { preloadedState: initialState });

    const searchInput = screen.getByPlaceholderText("Search games...");

    expect(searchInput.getAttribute("placeholder")).toBe("Search games...");
  });
});
