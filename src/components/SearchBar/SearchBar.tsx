"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";
import { AppDispatch, RootState } from "@/store/store";
import { getGames, setSearch } from "@/store/slices/lobbySlice";
import styles from "./SearchBar.module.scss";

export function SearchBar() {
  const dispatch = useDispatch<AppDispatch>();

  const { searchTerm: reduxSearchTerm, pageSize } = useSelector(
    (state: RootState) => state.lobby
  );

  const [localText, setLocalText] = useState(reduxSearchTerm ?? "");
  const [debouncedText] = useDebounce(localText, 500);
  const skipNextSearch = useRef(false);
  const isMounted = useRef(false);

  useEffect(() => {
    if (reduxSearchTerm === "" && localText !== "") {
      setLocalText("");
      skipNextSearch.current = true;
    } else if (reduxSearchTerm !== localText) {
      setLocalText(reduxSearchTerm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxSearchTerm]);

  useEffect(() => {
if (!isMounted.current) {
        isMounted.current = true;
        return; 
    }

    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }

    if ((debouncedText?.length ?? 0) >= 3 || debouncedText === "") {
      if (debouncedText !== reduxSearchTerm) {
        dispatch(setSearch(debouncedText));
        dispatch(
          getGames({
            selectedCategoryUrl: null,
            search: debouncedText,
            pageNumber: 1,
            pageSize,
          })
        );
      }
    }
  }, [debouncedText, reduxSearchTerm, dispatch, pageSize]);

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search games..."
        value={localText}
        onChange={(e) => setLocalText(e.target.value)}
      />
      <span className={styles.searchIcon}>🔍</span>
    </div>
  );
}
