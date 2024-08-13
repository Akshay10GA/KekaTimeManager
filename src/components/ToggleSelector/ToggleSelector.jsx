import React, { useEffect, useRef } from "react";
import "./ToggleSelector.css";

const ToggleSelector = ({ onTabChange }) => {
  const tabSelectorRef = useRef();
  const tabs = ["All", "Canvas"];

  const changeTab = (index) => {
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabSelectorRef.current.children[i].classList = ["active-tab"];
        onTabChange(tabSelectorRef.current.children[i].textContent);
      } else {
        tabSelectorRef.current.children[i].classList = [""];
      }
    }
  };

  useEffect(() => {
    tabSelectorRef.current.firstChild.classList = ["active-tab"];
  }, []);
  return (
    <div className="tab-selector-container" ref={tabSelectorRef}>
      {tabs.map((name, index) => (
        <div key={name} onClick={() => changeTab(index)}>
          {name}
        </div>
      ))}
    </div>
  );
};

export default ToggleSelector;
