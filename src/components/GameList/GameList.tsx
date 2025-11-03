"use client";

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useInView } from "react-intersection-observer";
import { RootState, AppDispatch } from "@/store/store";
import { getGames } from "@/store/slices/lobbySlice";
import { GameCard } from "../GameCard/GameCard";
import { Spinner } from "../ui/Spinner/Spinner";
import styles from "./GameList.module.scss";

export function GameList() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    games,
    isLoading,
    hasMore,
    pageNumber,
    selectedCategoryUrl,
    searchTerm,
    pageSize,
  } = useSelector((state: RootState) => state.lobby);

  const { ref, inView } = useInView({
    threshold: 0.5,
    rootMargin: "0px 0px 200px 0px",
  });

  useEffect(() => {
    if (inView && !isLoading && hasMore && games.length > 0) {
      dispatch(
        getGames({
          selectedCategoryUrl: selectedCategoryUrl,
          search: searchTerm,
          pageNumber: pageNumber,
          pageSize: pageSize,
        })
      );
    }
  }, [
    inView,
    isLoading,
    hasMore,
    games.length,
    dispatch,
    pageNumber,
    selectedCategoryUrl,
    searchTerm,
    pageSize,
  ]);

  const showEmptyState = !isLoading && games.length === 0;

  return (
    <div className={styles.listContainer}>
      {showEmptyState && (
        <div className={styles.emptyState}>
          <h3>No Games Found</h3>
          <p>Try changing your search term or selecting another category.</p>
        </div>
      )}

      <div className={styles.grid}>
        {games.map((game, index) => (
          <GameCard key={`${game.id} + ${index}`} game={game} />
        ))}
      </div>

      <div className={styles.loader} ref={ref}>
        {isLoading && <Spinner />}
        {!hasMore && games.length > 0 && (
          <p className={styles.endMessage}>You&apos;ve reached the end.</p>
        )}
      </div>
    </div>
  );
}
