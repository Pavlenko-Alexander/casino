"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setInitialData } from "@/store/slices/lobbySlice";
import { CategoryMenu } from "../CategoryMenu/CategoryMenu";
import { GameList } from "../GameList/GameList";
import { SearchBar } from "../SearchBar/SearchBar";
import styles from "./LobbyPage.module.scss";
import { Category, Game } from "@/lib/types";

interface LobbyPageProps {
  serverCategories: Category[];
  serverGames: Game[];
}

export default function LobbyPage({
  serverCategories,
  serverGames,
}: LobbyPageProps) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setInitialData({
        categories: serverCategories,
        initialGames: serverGames,
      })
    );
  }, [dispatch, serverCategories, serverGames]);

  return (
    <div className={styles.lobbyContainer}>
      <section className={styles.navbar}>
        <SearchBar />
        <CategoryMenu />
      </section>
      <section className={styles.gameGrid}>
        <GameList />
      </section>
    </div>
  );
}
