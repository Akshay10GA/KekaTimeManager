import React from "react";
import "./App.css";
import KekaTimeManager from "./KekaTimeManager/KekaTimeManager";
import AppCanvas from "./AppCanvas/AppCanvas";

const App = () => {
  return (
    <>
      <AppCanvas />
      <div className="app">
        <KekaTimeManager />
      </div>
    </>
  );
};

export default App;
