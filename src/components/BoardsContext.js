import React, { useState, createContext, useEffect } from "react";

export const BoardsContextComponent = ({ children }) => {
  const [boards, setBoards] = useState(null);
  const [loadingBoards, setLoadingBoards] = useState(true);

  const updateBoardsList = (boardsList) => {
    setBoards(boardsList);
    localStorage.setItem("boards", JSON.stringify(boardsList));
  };

  useEffect(() => {
    setBoards(JSON.parse(localStorage.getItem("boards")) || null);
  }, []);

  useEffect(() => {
    const loadBoards = async () => {
      try {
        await window.PDK.me("boards", { fields: "id,name" }, (b) => {
          if (b.error) {
            console.log(b.error);
            alert("Could not fetch boards. Try again later");
          } else {
            updateBoardsList(b.data);
          }
        });
      } catch (e) {
        alert("board fetching error", e);
      }
    };

    if (boards === null) {
      loadBoards();
      // updateBoardsList([{id: "574701671138706368", name: "Test"}])
    }
    setLoadingBoards(false);
  }, [boards]);

  return (
    <BoardsContext.Provider
      value={{
        boards,
        loadingBoards,
      }}
    >
      {children}
    </BoardsContext.Provider>
  );
};

export const BoardsContext = createContext({
  boards: null,
  loadingBoards: true,
});
