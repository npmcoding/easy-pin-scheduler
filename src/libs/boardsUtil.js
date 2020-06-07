import { useState, useEffect } from "react";
import { fetchBoards } from "./pinterestLib";
import { TWENTYFOURHOURS } from "./constants";

const shouldUpdateBoards = () => {
  const boardsUpdatedAtDate = localStorage.getItem("boardsUpdatedAt");
  const localBoards = localStorage.getItem("boards");
  const yesterday = Date.now() - TWENTYFOURHOURS;

  return (
    !localBoards || !boardsUpdatedAtDate || boardsUpdatedAtDate < yesterday
  );
};

export const useBoards = () => {
  const [boards, setBoards] = useState(JSON.parse(localStorage.getItem("boards")) || []);
  const [loadingBoards, setLoadingBoards] = useState(true);

  useEffect(() => {
    setLoadingBoards(true);
    console.log(shouldUpdateBoards())
    if (shouldUpdateBoards()) {
      try {
        fetchBoards(b => {
          if (b.error) {
            console.log(b.error);
            localStorage.setItem("boardsUpdatedAt", undefined);
            alert("Could not fetch boards. Try again later");
          } else if (b.data) {
            setBoards(b.data);
            localStorage.setItem("boards", JSON.stringify(b.data));
            localStorage.setItem("boardsUpdatedAt", Date.now());
            // setBoards([{id: "574701671138706368", name: "Test"}])
          }
          setLoadingBoards(false);
        });
      } catch (e) {
        localStorage.setItem("boardsUpdatedAt", undefined);
        alert("board fetching error", e);
      }
    }
    setLoadingBoards(false);
  }, [setLoadingBoards, setBoards]);

  return [boards, loadingBoards];
};
