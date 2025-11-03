import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        Pika<span className={styles.logoHighlight}>Kasino</span>
      </div>
      <nav className={styles.nav}>
        <span>Games</span>
        <span>Promotions</span>
        <span>Support</span>
      </nav>
    </header>
  );
}
