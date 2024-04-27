import { useState, useEffect } from "react";
import redClockImg from "../assets/images/redClock.png";
import blueClockImg from "../assets/images/blueClock.png";
import "./App.css";

export default function App() {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [breakTimeApplicable, setBreakTimeApplicable] = useState(true);
  const [shiftEnded, setShiftEnded] = useState(false);
  let [inputValue, setInputValue] = useState("");
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
  const [estimateFinishTime, setEstimateFinishTime] = useState("");
  const [estFinishHourNow, setEstFinishHourNow] = useState("");
  let clockTime = new Date();

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleEnterPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setCurrentHour(0);
    setCurrentMinutes(0);
    setCurrentSeconds(0);
    setEstimateFinishTime("");
    setDataLoaded(false);
    inputValue = inputValue.trim();
    let inputValueFormatted = inputValue
      .replaceAll("AM ", "AM,")
      .replaceAll("PM ", "PM,");
    fetch("https://kekatimecalculation.onrender.com/calculatetime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ time: inputValueFormatted }),
    })
      .then((response) => response.json())
      .then((data) => {
        setDataLoaded(true);
        const timenow = data.response.split(",");
        setResponseData(timenow);
        setCurrentHour(parseInt(timenow[0], 10));
        setCurrentMinutes(parseInt(timenow[1].trim(), 10));
        setCurrentSeconds(parseInt(timenow[2].trim(), 10));
        setTotalBreak(timenow[3]);
        setLunchBreak(timenow[4]);
        setOtherBreak(timenow[5]);
        timenow[6].includes("False")
          ? setBreakTimeApplicable(false)
          : setBreakTimeApplicable(true);
        timenow[7].includes("False")
          ? setShiftEnded(false)
          : setShiftEnded(true);
        setShowInfo(true);
      })
      .catch((error) => {
        setDataLoaded(true);
        setBreakTimeApplicable(false);
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEnterPress);
    if (estimateFinishTime == "" && (currentHour > 0 || currentMinutes > 0)) {
      let estFinishHour = 0;
      let estFinishMinute = 0;
      let runningClockTime =
        clockTime.getHours() > 12
          ? clockTime.getHours() - 12
          : clockTime.getHours();
      estFinishHour = 8 - currentHour + runningClockTime;
      estFinishMinute = 60 - currentMinutes + clockTime.getMinutes();
      estFinishMinute > 60 ? (estFinishHour = estFinishHour + 1) : "";
      estFinishMinute > 60 ? (estFinishMinute = estFinishMinute - 60) : "";
      console.log(estFinishHour, "estFinishHour");
      console.log(estFinishMinute, "estFinishMinute");
      console.log(currentHour, "currentHour");
      console.log(currentMinutes, "currentMinutes");
      console.log(clockTime.getHours(), "clockTime.getHours()");
      console.log(clockTime.getMinutes(), "clockTime.getMinutes()");
      currentHour >= 9
        ? setEstFinishHourNow(`9 Hr Completed`)
        : setEstFinishHourNow(`${estFinishHour} : ${estFinishMinute}`);
      setEstimateFinishTime(`${estFinishHour} : ${estFinishMinute}`);
    }

    let element25 = document.getElementById("25per");
    let element50 = document.getElementById("50per");
    let element75 = document.getElementById("75per");
    let element100 = document.getElementById("100per");

    parseFloat(`${currentHour}.${currentMinutes}`) >= 2.25
      ? element25.classList.add("active")
      : element25.classList.remove("active");
    parseFloat(`${currentHour}.${currentMinutes}`) >= 4.5
      ? element50.classList.add("active")
      : element50.classList.remove("active");
    parseFloat(`${currentHour}.${currentMinutes}`) >= 6.75
      ? element75.classList.add("active")
      : element75.classList.remove("active");
    parseFloat(`${currentHour}.${currentMinutes}`) >= 9
      ? element100.classList.add("active")
      : element100.classList.remove("active");

    let timeNow = new Date();
    if (timeNow.getHours() > 12) {
      setRunningHour(timeNow.getHours() - 12);
    }
    setRunningMinutes(timeNow.getMinutes());
    setRunningSeconds(timeNow.getSeconds());
    const timer = setTimeout(() => {
      currentMinutes > 59 ? setCurrentHour((prevHour) => prevHour + 1) : "";
      currentMinutes > 59
        ? setCurrentMinutes((prevMinutes) => prevMinutes * 0)
        : "";
      currentSeconds > 59
        ? setCurrentMinutes((prevMinutes) => prevMinutes + 1)
        : "";
      currentSeconds > 59
        ? setCurrentSeconds((prevSeconds) => prevSeconds * 0)
        : "";
      setCurrentSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleEnterPress);
    };
  }, [currentSeconds]);

  return (
    <>
      <div id="bg">
        {/* loader */}
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
          {/* Your time card */}
          <div className="main-body-container">
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
                      {shiftEnded
                        ? parseInt(responseData[1], 10)
                        : currentMinutes}{" "}
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
                        Overtime Hours : {currentHour - 9} Hours,{" "}
                        {currentMinutes} Minutes
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

            {/* progress bar */}
            <div className="container">
              <div className="progress-container">
                <div className="progress" id="progress"></div>
                <div id="25per" className="circle ">
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
            </div>

            {/* break time card */}
            <div className="main-box-container">
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
            <button className="actual-calulcate-button" onClick={handleSubmit}>
              Calculate
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
