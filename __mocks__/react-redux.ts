export const useDispatch = jest.fn();
export const useSelector = jest.fn((selector) =>
  selector({
    lobby: {
      games: [],
      isLoading: false,
      hasMore: true,
      pageNumber: 1,
      categories: [],
      selectedCategoryId: null,
    },
  })
);
export const Provider = ({ children }: { children: React.ReactNode }) => children;