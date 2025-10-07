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

  useEffect(()=>{
    changeTab(Array.from(tabSelectorRef.current.children).findIndex((element)=>element.innerText.toLowerCase()===selectedTab), false);
  }, [selectedTab])

  const changeTab = (index, apply) => {
    for (let i = 0; i < tabs.length; i++) {
      if (i === index) {
        tabSelectorRef.current.children[i].classList = ["active-tab"];
        if (apply){
          onTabChange(tabSelectorRef.current.children[i].textContent);
        }

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
          changeTab(index, true);
        }
      } else {
        tabSelectorRef.current.firstChild.classList = ["active-tab"];
        changeTab(0, true);
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
        <div key={name} onClick={() => changeTab(index, true)}>
          {name}
        </div>
      ))}
    </div>
  );
};

export default ToggleSelector;
