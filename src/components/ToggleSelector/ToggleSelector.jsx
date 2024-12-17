import React, { useEffect, useRef } from "react";
import "./ToggleSelector.css";

const ToggleSelector = ({
  onTabChange,
  tabs,
  top,
  right,
  bottom,
  left,
  selectedTab,
}) => {
  const tabSelectorRef = useRef();

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
    Array.from(tabSelectorRef.current.children).forEach((element, index) => {
      if (selectedTab) {
        if (element.innerText.toLowerCase() === selectedTab) {
          tabSelectorRef.current.children[index].classList = ["active-tab"];
          changeTab(index);
        }
      } else {
        tabSelectorRef.current.firstChild.classList = ["active-tab"];
        changeTab(0);
      }
    });
  }, []);
  return (
    <div
      className="tab-selector-container"
      ref={tabSelectorRef}
      style={{ top: top, right: right, left: left, bottom: bottom }}
    >
      {tabs.map((name, index) => (
        <div key={name} onClick={() => changeTab(index)}>
          {name}
        </div>
      ))}
    </div>
  );
};

export default ToggleSelector;
