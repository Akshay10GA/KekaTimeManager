import React from "react";
import "./TimeInput.css";

const TimeInput = ({ value, onInputChange }) => {
  return (
    <div className="input-time keka-manager">
      <div className="input-container">
        <input
          className="input-field"
          type="text"
          placeholder="Enter your time"
          value={value} // Controlled input
          onChange={onInputChange}
        />
        {/* Border animation segments */}
        <span className="border-top"></span>
        <span className="border-right"></span>
        <span className="border-bottom"></span>
        <span className="border-left"></span>
      </div>
    </div>
  );
};

export default TimeInput;