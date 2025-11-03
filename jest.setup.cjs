jest.mock('use-debounce', () => ({
  useDebounce: (value) => [value],
}));

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: jest.fn(),
    inView: false,
  }),
}));

jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  fetchGames: jest.fn(() => 
    Promise.resolve({ games: [], totalGames: 0 })
  ),
}));

jest.mock("next/image", () => {
  return function MockedNextImage(props) {
    const { src, alt, fill, width, height, ...rest } = props;
    return React.createElement("img", {
      src,
      alt,
      width: fill ? "100%" : width,
      height: fill ? "100%" : height,
      style: fill ? { objectFit: "cover" } : undefined,
      ...rest,
    });
  };
});