import { fetchCategories, fetchInitialGames } from "@/lib/api";
import { Game } from "@/lib/types";
import LobbyPage from "@/components/LobbyPage/LobbyPage";
import { Header } from "@/components/Header/Header";
import styles from "./page.module.scss";

async function getLobbyData() {
  try {
    const configData = await fetchCategories();
    console.log(configData);
    const allCategories = configData?.menu?.lobby?.items || [];

    const categories = allCategories.filter(
      (category) => category.name.toLowerCase() !== "lobby"
    );

    const initialCategoryUrl = categories[0]?.links?.getPage;

    let initialGames: Game[] = [];
    if (initialCategoryUrl) {
      const gamesData = await fetchInitialGames(initialCategoryUrl);
      initialGames = gamesData?.games || [];
    }

    return { categories, initialGames };
  } catch (error) {
    console.error("Failed to fetch initial server data:", error);
    return { categories: [], initialGames: [] };
  }
}

export default async function Home() {
  const { categories, initialGames } = await getLobbyData();

  return (
    <>
      <Header />
      <main className={styles.main}>
        <LobbyPage serverCategories={categories} serverGames={initialGames} />
      </main>
    </>
  );
}
