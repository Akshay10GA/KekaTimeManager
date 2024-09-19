import React, { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import Cards from "../components/Cards/Cards";
import TimeInput from "../components/TimeInput/TimeInput";
import CalculateButton from "../components/CalculateButton/CalculateButton";
import "./KekaTimeManager.css";
import ToggleSelector from "../components/ToggleSelector/ToggleSelector";
import { Backgrounds } from "../Background";

const KekaTimeManager = () => {
  const [renderer, setRenderer] = useState(true);
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

  const [showKekaCalculator, setShowKekaCalculator] = useState(true);
  const toggleView = (view) => {
    if (view.toLowerCase() == "canvas") {
      setShowKekaCalculator(false);
    } else {
      setShowKekaCalculator(true);
    }
  };

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

  const updateProgressBar = () => {
    var r = document.querySelector(":root");
    var completedPercentage =
      (parseFloat(`${currentHour}.${currentMinutes}`) / 9) * 100 + "%";
    r.style.setProperty("--bar-percentage", completedPercentage);
  };

  const changeBackground = (newTheme) => {
    const theme = localStorage.getItem("canvasTheme");
    if (theme != newTheme) {
      localStorage.setItem("canvasTheme", newTheme);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  // useEffect(() => {
  //   updateProgressBar()
  // })

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

    if (element25 && element50 && element75 && element100) {
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
    }

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
    updateProgressBar();
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleEnterPress);
    };
  }, [currentSeconds]);

  useEffect(() => {
    setRenderer(!renderer);
  }, [showKekaCalculator]);
  return (
    <>
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
      <ToggleSelector onTabChange={toggleView} />
      {!showKekaCalculator && (
        <div className="background-options">
          {Object.entries(Backgrounds).map(([key, value]) => (
            <>
              {
                <button key={key} onClick={() => changeBackground(value)}>
                  <strong>{key}</strong>
                </button>
              }
            </>
          ))}
        </div>
      )}
      {showKekaCalculator && (
        <div className={`${!dataLoaded ? "loader-active" : ""}`}>
          <ProgressBar />
          <Cards
            showInfo={showInfo}
            shiftEnded={shiftEnded}
            responseData={responseData}
            currentHour={currentHour}
            currentMinutes={currentMinutes}
            currentSeconds={currentSeconds}
            estFinishHourNow={estFinishHourNow}
            breakTimeApplicable={breakTimeApplicable}
            totalBreak={totalBreak}
            lunchBreak={lunchBreak}
            otherBreak={otherBreak}
            clockTime={clockTime}
          />
          <TimeInput onInputChange={handleChange} />
          <CalculateButton onCalculate={handleSubmit} />
        </div>
      )}
    </>
  );
};

export default KekaTimeManager;
