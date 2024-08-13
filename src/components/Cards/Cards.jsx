import React, { useState } from "react";
import blueClockImg from "../../../assets/images/blueClock.png";
import redClockImg from "../../../assets/images/redClock.png";
import "./Cards.css";

const Cards = ({
  showInfo,
  shiftEnded,
  responseData,
  currentHour,
  currentMinutes,
  currentSeconds,
  estFinishHourNow,
  breakTimeApplicable,
  totalBreak,
  lunchBreak,
  otherBreak,
  clockTime,
}) => {
  return (
    <div className="cards-container">
      <div className="cards-inner-container">
        {/* Left Card */}
        <div className="main-box-container">
          <div className="box-container">
            <img src={blueClockImg} />
            <h3>Your Time</h3>
            {showInfo && (
              <div className="my-time-container">
                <span className="hour-headings">
                  Completed Hours :{" "}
                  {shiftEnded ? parseInt(responseData[0], 10) : currentHour}{" "}
                  Hours,{" "}
                  {shiftEnded ? parseInt(responseData[1], 10) : currentMinutes}{" "}
                  Minutes{" "}
                </span>
                <br />
                {currentHour < 9 && (
                  <span className="hour-headings">
                    Remaining Hours :{" "}
                    {shiftEnded
                      ? 8 - parseInt(responseData[0], 10)
                      : 8 - currentHour}{" "}
                    Hours,{" "}
                    {shiftEnded
                      ? 60 - parseInt(responseData[1], 10)
                      : 60 - currentMinutes}{" "}
                    Minutes
                  </span>
                )}
                {currentHour >= 9 && (
                  <span className="hour-headings">
                    Overtime Hours : {currentHour - 9} Hours, {currentMinutes}{" "}
                    Minutes
                  </span>
                )}
                <br />
                {!shiftEnded && (
                  <>
                    <span className="hour-headings">
                      Completes At - {estFinishHourNow}
                    </span>
                    <br />
                    <span className="hour-headings">
                      Current Time - {clockTime.toLocaleTimeString()}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Card */}
        <div className="main-box-container red-clock-position">
          <div className="box-container-2">
            <img src={redClockImg} />
            <h3>Break Time</h3>
            {showInfo && (
              <div className="my-time-container">
                {breakTimeApplicable && (
                  <>
                    <span className="hour-headings">
                      Total Break : {totalBreak}
                    </span>
                    <br />
                    <span className="hour-headings">
                      Lunch Break : {lunchBreak}
                    </span>
                    <br />
                    <span className="hour-headings">
                      Other Time : {otherBreak}
                    </span>
                    <br />
                  </>
                )}
                {!breakTimeApplicable && (
                  <span className="hour-headings">No breaks taken</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
