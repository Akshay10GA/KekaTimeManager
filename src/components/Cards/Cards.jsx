import React from "react";
import "./Cards.css";

const DashboardPanel = ({
  showInfo,
  shiftEnded,
  responseData,
  currentTime,
  estFinishTime,
  breakData,
}) => {
  const { h, m } = currentTime;
  const { breakTimeApplicable, totalBreak, lunchBreak, otherBreak } = breakData;

  // Calculate remaining or overtime
  const remainingH = 8 - h;
  const remainingM = 60 - m;
  const overtimeH = h - 9;
  const isOvertime = h >= 9;

  if (!showInfo) return null;

  return (
    <div className="dashboard-container">
      {/* SECTION 1: PRIMARY WORK STATS */}
      <div className="dashboard-section primary-stats">
        <div className="stat-block hero-stat">
          <span className="stat-label">Time Completed</span>
          <span className="stat-value highlight">
            {shiftEnded ? responseData[0] : h}
            <span className="unit">h</span> {shiftEnded ? responseData[1] : m}
            <span className="unit">m</span>
          </span>
        </div>

        <div className="stat-block">
          <span className="stat-label">
            {isOvertime ? "Overtime" : "Remaining Time"}
          </span>
          <span className={`stat-value ${isOvertime ? "overtime-text" : ""}`}>
            {isOvertime ? overtimeH : shiftEnded ? 8 - responseData[0] : remainingH}
            <span className="unit">h</span>{" "}
            {isOvertime ? m : shiftEnded ? 60 - responseData[1] : remainingM}
            <span className="unit">m</span>
          </span>
        </div>
      </div>

      <div className="dashboard-divider"></div>

      {/* SECTION 2: TIMELINE */}
      <div className="dashboard-section timeline-stats">
        {!shiftEnded && (
          <div className="stat-block">
            <span className="stat-label">Estimated Finish</span>
            <span className="stat-value small-value">{estFinishTime}</span>
          </div>
        )}
        <div className="stat-block">
          <span className="stat-label">Current Time</span>
          <span className="stat-value small-value">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      <div className="dashboard-divider"></div>

      {/* SECTION 3: BREAKS */}
      <div className="dashboard-section break-stats">
        <div className="section-title">Break Breakdown</div>
        {breakTimeApplicable ? (
          <div className="break-grid">
            <div className="break-item">
              <span className="break-label">Total Break</span>
              <span className="break-val">{totalBreak}</span>
            </div>
            <div className="break-item">
              <span className="break-label">Lunch</span>
              <span className="break-val">{lunchBreak}</span>
            </div>
            <div className="break-item">
              <span className="break-label">Other</span>
              <span className="break-val">{otherBreak}</span>
            </div>
          </div>
        ) : (
          <div className="no-break-text">No breaks taken yet.</div>
        )}
      </div>
    </div>
  );
};

export default DashboardPanel;