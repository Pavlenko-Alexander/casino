"use client";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { getGames, setCategory } from "@/store/slices/lobbySlice";
import styles from "./CategoryMenu.module.scss";

export function CategoryMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, selectedCategoryUrl, pageSize, isLoading } = useSelector(
    (state: RootState) => state.lobby
  );

  const handleCategoryClick = (categoryUrl: string) => {
    if (categoryUrl === selectedCategoryUrl || isLoading) return;

    dispatch(setCategory(categoryUrl));

    dispatch(
      getGames({
        selectedCategoryUrl: categoryUrl,
        search: undefined,
        pageNumber: 1,
        pageSize: pageSize,
      })
    );
  };

  return (
    <ul className={styles.categoryList}>
      {categories.map(
        (category: {
          id: string;
          name: string;
          links: { getPage: string };
        }) => (
          <li key={category.id}>
            <button
              className={`${styles.categoryButton} ${
                category.links.getPage === selectedCategoryUrl
                  ? styles.active
                  : ""
              }`}
              onClick={() => handleCategoryClick(category.links.getPage)}
              disabled={isLoading}
            >
              {category.name}
            </button>
          </li>
        )
      )}
    </ul>
  );
}
