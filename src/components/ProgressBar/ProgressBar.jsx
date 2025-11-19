// import React from "react";
import "./ProgressBar.css";

const ProgressBar = () => {
  return (
    <section className="progress-section">
      <div className="progress-container">
        <div className="progress" id="progress"></div>
        <div id="0per" className="circle active">
          0%
        </div>
        <div id="25per" className="circle">
          25%
        </div>
        <div id="50per" className="circle ">
          50%
        </div>
        <div id="75per" className="circle">
          75%
        </div>
        <div id="100per" className="circle">
          100%
        </div>
      </div>
    </section>
  );
};

export default ProgressBar;
