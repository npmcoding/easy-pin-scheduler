import React, { useState, createContext, useEffect, useCallback } from "react";
import config from "../../config";
import { shouldUpdateBoards, loadBoards } from "./boardsUtil";

export const PinterestContextComponent = ({ children }) => {
  const [PDKInitialized, setPDKInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [boards, setBoards] = useState(null);
  const [loadingBoards, setLoadingBoards] = useState(false);

  useEffect(() => {
    window.PDK.init({ appId: config.PINTEREST_APP_ID, cookie: true });
    console.log(window.PDK.getSession())
    setIsConnected(!!window.PDK.getSession());
    setPDKInitialized(true);

    setBoards(JSON.parse(localStorage.getItem("boards")) || null);
  }, []);


  const fetchBoards = useCallback(() => {
    if (PDKInitialized && shouldUpdateBoards()) {
      loadBoards(setBoards, setLoadingBoards);
    }
  },[PDKInitialized]);

  const onConnectClick = () => {
    const scope = "read_public, write_public";
    window.PDK.login({ scope }, (accessToken) => {
      setIsConnected(!!accessToken);
    });
  };

  const onDisconnectClick = () => {
    window.PDK.logout();
    setIsConnected(false);
  };

  return (
    <PinterestContext.Provider
      value={{
        PDKInitialized,
        isConnected,
        boards,
        loadingBoards,
        fetchBoards,
        onConnectClick,
        onDisconnectClick,
      }}
    >
      {children}
    </PinterestContext.Provider>
  );
};

export const PinterestContext = createContext({
  PDKInitialized: false,
  isConnected: false,
  boards: null,
  loadingBoards: false,
  fetchBoards: () => {},
  onConnectClick: () => {},
  onDisconnectClick: () => {},
});
