import React from "react";
import "./CalculateButton.css";

const CalculateButton = ({ onCalculate }) => {
  return (
    <div className="calulcate-button">
      <button className="actual-calulcate-button" onClick={onCalculate}>
        Calculate
      </button>
    </div>
  );
};

export default CalculateButton;
