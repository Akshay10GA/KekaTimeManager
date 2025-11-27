import React from "react";
import "./ProgressBar.css";

const ProgressBar = React.memo(({ hoursCompleted = 0 }) => {
  // Logic Refinement: Ensure percentage never exceeds 100% or drops below 0%
  const percentage = Math.min(Math.max((hoursCompleted / 9) * 100, 0), 100);
  
  // Logic Refinement: Helper for cleaner class logic
  const getCircleClass = (threshold) => {
    return `circle ${hoursCompleted >= threshold ? "active" : ""}`;
  };

  return (
    <section className="progress-section joyride-progress-bar">
      {/* Pass the percentage as a CSS Variable to this specific container */}
      <div 
        className="progress-container" 
        style={{ "--bar-percentage": `${percentage}%` }}
      >
        <div className="progress" id="progress"></div>
        
        {/* Milestones */}
        <div id="0per" className={getCircleClass(0)}>0%</div>
        <div id="25per" className={getCircleClass(2.25)}>25%</div>
        <div id="50per" className={getCircleClass(4.5)}>50%</div>
        <div id="75per" className={getCircleClass(6.75)}>75%</div>
        <div id="100per" className={getCircleClass(9)}>100%</div>
      </div>
    </section>
  );
});

export default ProgressBar;