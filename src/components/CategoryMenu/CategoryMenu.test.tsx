import "@testing-library/jest-dom";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/utils/test-utils";
import { CategoryMenu } from "./CategoryMenu";
import { fetchGames } from "@/lib/api";
import { lobbyInitialState } from "@/store/slices/lobbySlice";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { Category } from "@/lib/types";

const mockedClientFetch = fetchGames as jest.MockedFunction<typeof fetchGames>;

const mockCategories: Category[] = [
  { id: "1", name: "Popular", links: { getPage: "popular" } },
  { id: "2", name: "New", links: { getPage: "new" } },
];

describe("CategoryMenu", () => {
  beforeEach(() => {
    mockedClientFetch.mockClear();
    mockedClientFetch.mockResolvedValue({ games: [], totalGames: 0 });
  });

  it("renders categories", () => {
    const preloadedState = {
      lobby: {
        ...lobbyInitialState,
        categories: mockCategories,
        selectedCategoryId: "slots",
      },
    };

    renderWithProviders(<CategoryMenu />, { preloadedState });

    const categoryList = screen.getByRole("list");
    expect(categoryList.classList.contains("categoryList")).toBe(true);
  });
});
