const TWENTYFOURHOURSINMILLISECONDS = 24 * 60 * 60 * 1000;

export const shouldUpdateBoards = () => {
  const boardsUpdatedAtDate = localStorage.getItem("boardsUpdatedAt");
  const localBoards = localStorage.getItem("boards");
  const yesterday = Date.now() - TWENTYFOURHOURSINMILLISECONDS;

  return (
    !localBoards || !boardsUpdatedAtDate || boardsUpdatedAtDate < yesterday
  );
};

export const loadBoards = async (setBoards, setLoadingBoards) => {
  // if (PDKInitialized) {
  setLoadingBoards(true);
  try {
    await window.PDK.me("boards", { fields: "id,name" }, (b) => {
      if (b.error) {
        console.log(b.error);
        localStorage.setItem("boardsUpdatedAt", undefined);
        alert("Could not fetch boards. Try again later");
      } else {
        setBoards(b.data);
        localStorage.setItem("boards", JSON.stringify(b.data));
        localStorage.setItem("boardsUpdatedAt", Date.now());
        // setBoards([{id: "574701671138706368", name: "Test"}])
      }
    });
  } catch (e) {
    localStorage.setItem("boardsUpdatedAt", undefined);
    alert("board fetching error", e);
  }
  setLoadingBoards(false);
  // }
};
