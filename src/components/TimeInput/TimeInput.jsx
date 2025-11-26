import React, { useState } from "react";
import "./TimeInput.css";

const TimeInput = ({ onInputChange }) => {
  return (
    <div className="input-time keka-manager">
      <input
        className="input-field"
        type="text"
        placeholder="Enter you time"
        onChange={onInputChange}
      />
    </div>
  );
};

export default TimeInput;
