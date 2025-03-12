import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import SongList from "./SongList";
import SongPage from "./SongPage";
import { useAccessToken } from "./contexts/useAccessToken";

// context - hook from react
// defining custom hooks - creating our own hooks

const Protected = ({ children }) => {
  const { accessToken } = useAccessToken();
  if (!accessToken) {
    return <div>You need to login</div>;
  }

  return children;
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <Protected>
              <SongList />
            </Protected>
          }
        />
        <Route
          path="/songs/:songId"
          element={
            <Protected>
              <SongPage />
            </Protected>
          }
        />
      </Routes>
    </>
  );
}

export default App;
