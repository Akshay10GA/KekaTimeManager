import { useState , useEffect  } from "react";

import "./App.css";

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [breakTimeApplicable, setBreakTimeApplicable] = useState(true);
  const [shiftEnded, setShiftEnded] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [responseData, setResponseData] = useState(null);
  const [currentHour, setCurrentHour] = useState(0);
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const [runningHour, setRunningHour] = useState(0);
  const [runningMinutes, setRunningMinutes] = useState(0);
  const [runningSeconds, setRunningSeconds] = useState(0);
  const [totalBreak, setTotalBreak] = useState(0);
  const [lunchBreak, setLunchBreak] = useState(0);
  const [otherBreak, setOtherBreak] = useState(0);
  let timeNow = new Date();

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    setDataLoaded(false);
    let inputValueFormatted = inputValue.replaceAll("AM ", "AM,").replaceAll("PM ", "PM,");
    fetch('http://localhost:3000/calculatetime', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ time: inputValueFormatted }),
    })
    .then(response => response.json())
    .then(data => {
      setDataLoaded(true);
      const timenow = data.response.split(",");
      setResponseData(data);
      setCurrentHour(parseInt(timenow[0], 10));
      setCurrentMinutes(parseInt(timenow[1].trim(), 10));
      setCurrentSeconds(parseInt(timenow[2].trim(), 10));
      setTotalBreak(timenow[3]);
      setLunchBreak(timenow[4]);
      setOtherBreak(timenow[5]);
      timenow[6].includes("False") ? setBreakTimeApplicable(false) : setBreakTimeApplicable(true); 
      timenow[7].includes("False") ? setShiftEnded(false) : setShiftEnded(true); 
    })
    .catch(error => {
      setDataLoaded(true);
      console.error('Error:', error);
    });
  };

  useEffect(() => {
    if(timeNow.getHours() > 12){
      setRunningHour(timeNow.getHours() - 12)  
    }
    setRunningMinutes(timeNow.getMinutes())
    setRunningSeconds(timeNow.getSeconds())
    const timer = setTimeout(() => {
      (currentMinutes > 59) ? (setCurrentHour(prevHour => prevHour + 1)) : '';
      (currentMinutes > 59) ? (setCurrentMinutes(prevMinutes => prevMinutes * 0)) : '';
      (currentSeconds > 59) ? (setCurrentMinutes(prevMinutes => prevMinutes + 1)) : '';
      (currentSeconds > 59) ? (setCurrentSeconds(prevSeconds => prevSeconds * 0)) : '';
      setCurrentSeconds(prevSeconds => prevSeconds + 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [currentSeconds]);

  return (
    <>
      <div id="bg">
        {!dataLoaded && (
          <div className="hourglassBackground">
            <div className="hourglassContainer">
              <div className="hourglassCurves"></div>
              <div className="hourglassCapTop"></div>
              <div className="hourglassGlassTop"></div>
              <div className="hourglassSand"></div>
              <div className="hourglassSandStream"></div>
              <div className="hourglassCapBottom"></div>
              <div className="hourglassGlass"></div>
            </div>
          </div>
        )}
        <div className={`App ${!dataLoaded ? "loader-active" : ""}`}>
          <div className="main-body-container">
            <div className="main-box-container">
              <div className="box-container">
                <img src="./assets/images/redClock.png" />
                <h3>Your Time</h3>
                {dataLoaded && (
                  <div className="my-time-container">
                    <span className="hour-headings">Completed Hours : {currentHour} Hours, {currentMinutes} Minutes </span>
                    <br />
                    <span className="hour-headings">Remaining Hours : {8-currentHour} Hours, {60 - currentMinutes} Minutes</span>
                    <br />
                    {shiftEnded && (
                    <span className="hour-headings">Completes At {currentHour < 8 ? 8 - currentHour + runningHour : currentHour > 8 ? 8 - (currentHour - runningHour) : runningHour}{' '} : {' '} {currentMinutes < 59 ? 59 - currentMinutes + runningMinutes : currentMinutes === 59 && runningMinutes === 0 ? 0 : runningMinutes}</span>
                    )}
                    <br />
                  </div>
                )}
              </div>
            </div>

            <div className="main-box-container">
              <div className="box-container-2">
                <img src="./assets/images/blueClock.png" />
                <h3>Break Time</h3>
                {dataLoaded && (
                  <div className="my-time-container">
                    {breakTimeApplicable &&(
                      <>
                    <span className="hour-headings">Total Break : {totalBreak}</span>
                    <br />
                    <span className="hour-headings">Lunch Break : {lunchBreak}</span>
                    <br />
                    <span className="hour-headings">Other Time : {otherBreak}</span>
                    <br />
                      </>
                    )}
                    {!breakTimeApplicable &&(
                    <span className="hour-headings">No breaks taken</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="input-time">
            <input
              className="input-field"
              type="text"
              placeholder="Enter you time"
              onChange={handleChange}
            />
          </div>
          <br />

          <div className="calulcate-button">
            <button className="actual-calulcate-button" onClick={handleSubmit} >Calculate</button>
          </div>
        </div>
      </div>
    </>
  );
}
