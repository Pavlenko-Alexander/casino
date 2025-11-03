"use client";

import Image from "next/image";
import styles from "./GameCard.module.scss";
import { Game } from "@/lib/types";

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const placeholderImage = "/placeholder-game.png";

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={game.thumbnail || placeholderImage}
          alt={game.name}
          fill
          sizes="180px"
          loading="eager"
          className={styles.gameImage}
        />
      </div>
      <div className={styles.cardOverlay}>
        <h3 className={styles.gameName}>{game.name}</h3>
        <button className={styles.playButton}>Play</button>
      </div>
    </div>
  );
}
