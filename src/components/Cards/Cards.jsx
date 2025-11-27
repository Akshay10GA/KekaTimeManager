import blueClockImg from "../../../assets/images/blueClock.png";
import redClockImg from "../../../assets/images/redClock.png";
import "./Cards.css";

const Cards = ({
  showInfo,
  shiftEnded,
  responseData,
  currentTime,
  estFinishTime,
  breakData
}) => {
  const { h, m } = currentTime;
  const { breakTimeApplicable, totalBreak, lunchBreak, otherBreak } = breakData;

  // Calculate remaining or overtime
  const remainingH = 8 - h;
  const remainingM = 60 - m;
  const overtimeH = h - 9;
  
  return (
    <div className="cards-container">
      <div className="cards-inner-container">
        {/* Work Time Card */}
        <div className="main-box-container joyride-blue-clock-position">
          <div className="box-container">
            <img src={blueClockImg} alt="Blue Clock" />
            <h3>Your Time</h3>
            {showInfo && (
              <div className="my-time-container">
                <span className="hour-headings">
                  Completed: {shiftEnded ? responseData[0] : h} Hours, {shiftEnded ? responseData[1] : m} Minutes
                </span>
                <br />
                {h < 9 ? (
                  <span className="hour-headings">
                    Remaining: {shiftEnded ? 8 - responseData[0] : remainingH} Hours, {shiftEnded ? 60 - responseData[1] : remainingM} Minutes
                  </span>
                ) : (
                  <span className="hour-headings">
                    Overtime: {overtimeH} Hours, {m} Minutes
                  </span>
                )}
                <br />
                {!shiftEnded && (
                  <>
                    <span className="hour-headings">Completes At: {estFinishTime}</span>
                    <br />
                    <span className="hour-headings">Current Time: {new Date().toLocaleTimeString()}</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Break Time Card */}
        <div className="main-box-container red-clock-position joyride-red-clock-position">
          <div className="box-container-2">
            <img src={redClockImg} alt="Red Clock" />
            <h3>Break Time</h3>
            {showInfo && (
              <div className="my-time-container">
                {breakTimeApplicable ? (
                  <>
                    <span className="hour-headings">Total Break: {totalBreak}</span><br />
                    <span className="hour-headings">Lunch Break: {lunchBreak}</span><br />
                    <span className="hour-headings">Other Time: {otherBreak}</span>
                  </>
                ) : (
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