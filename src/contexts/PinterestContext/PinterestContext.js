import React, { useState, createContext, useEffect, useCallback } from "react";
import config from "../../config";
import { shouldUpdateBoards, loadBoards } from "./boardsUtil";

export const PinterestContextComponent = ({ children }) => {
  const [PDKInitialized, setPDKInitialized] = useState(false);
  const [pinterestAccessToken, setPinterestAccessToken] = useState(null);
  const [boards, setBoards] = useState(null);
  const [loadingBoards, setLoadingBoards] = useState(false);

  useEffect(() => {
    window.PDK.init({ appId: config.PINTEREST_APP_ID, cookie: true });
    setPDKInitialized(true);

    const { accessToken } = window.PDK.getSession();
      setPinterestAccessToken(accessToken || null);

      setBoards(JSON.parse(localStorage.getItem("boards")) || null);
  }, []);

  const fetchBoards = useCallback(() => {
    if (PDKInitialized && shouldUpdateBoards()) {
      loadBoards(setBoards, setLoadingBoards);
    }
  }, [PDKInitialized]);

  const onConnectClick = () => {
    const scope = "read_public, write_public";
    window.PDK.login({ scope }, (accessToken) => {
      setPinterestAccessToken(accessToken);
    });
  };

  const onDisconnectClick = () => {
    window.PDK.logout();
    setPinterestAccessToken(null);
  };

  return (
    <PinterestContext.Provider
      value={{
        PDKInitialized,
        pinterestAccessToken,
        isConnected: !!pinterestAccessToken,
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
  pinterestAccessToken: null,
  boards: null,
  loadingBoards: false,
  fetchBoards: () => {},
  onConnectClick: () => {},
  onDisconnectClick: () => {},
});
