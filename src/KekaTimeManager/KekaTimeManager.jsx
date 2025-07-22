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
  const [totalBreak, setTotalBreak] = useState("00:00:00");
  const [lunchBreak, setLunchBreak] = useState("00:00:00");
  const [otherBreak, setOtherBreak] = useState("00:00:00");
  const [estimateFinishTime, setEstimateFinishTime] = useState("");
  const [estFinishHourNow, setEstFinishHourNow] = useState("");
  let clockTime = new Date();

  const [showKekaCalculator, setShowKekaCalculator] = useState(true);

  const toggleView = (view) => {
    if (view.toLowerCase() == "canvas") {
      setShowKekaCalculator(false);
      localStorage.setItem("view", true);
    } else if (view.toLowerCase() == "all") {
      setShowKekaCalculator(true);
      localStorage.setItem("view", false);
    } else if (view.toLowerCase() == "default") {
      localStorage.setItem("useDefault", true);
    } else if (view.toLowerCase() == "select") {
      localStorage.setItem("useDefault", false);
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

  const calculateTimes = (shiftTimesStr) => {
    const breakTime = {
      total_break_time: 0,
      lunch_break: 0,
      other_break: 0
    };

    const reverseListWithCurrentTime = (timeList) => {
      const newTimeList = [];
      const now = new Date();
      const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      for (const timeStr of timeList) {
        if (timeStr === "MISSING") {
          const currentTime = new Date();
          currentTime.setHours(currentTime.getHours());
          currentTime.setMinutes(currentTime.getMinutes());
          newTimeList.push(currentTime);
        } else {
          const [time, period] = timeStr.split(' ');
          const [hours, minutes, seconds] = time.split(':').map(Number);
          
          let hour = hours;
          if (period === 'PM' && hours !== 12) hour += 12;
          if (period === 'AM' && hours === 12) hour = 0;
          
          const dateTime = new Date(currentDate);
          dateTime.setHours(hour, minutes, seconds);
          newTimeList.push(dateTime);
        }
      }
      return newTimeList;
    };

    const calculateTotalHours = (reversedList) => {
      let totalHours = 0; // in milliseconds
      const list = [...reversedList];
      
      while (list.length >= 2) {
        const diff = list[1] - list[0];
        totalHours += diff;
        list.shift();
        list.shift();
      }
      
      return totalHours;
    };

    const calculateBreakTime = (reversedList) => {
      const list = [...reversedList];
      if (list.length < 4) return breakTime;
      
      list.shift();
      list.pop();
      
      const tempList = [];
      let totalBreakHours = 0;
      
      while (list.length >= 2) {
        const diff = list[1] - list[0];
        totalBreakHours += diff;
        tempList.push(diff);
        list.shift();
        list.shift();
      }
      
      if (tempList.length > 0) {
        const maxBreak = Math.max(...tempList);
        breakTime.total_break_time = totalBreakHours;
        breakTime.lunch_break = maxBreak;
        breakTime.other_break = totalBreakHours - maxBreak;
      }
      
      return breakTime;
    };

    const formatTime = (ms) => {
      if (!ms) return "00:00:00";
      const seconds = Math.floor(ms / 1000);
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const shiftTimes = shiftTimesStr.split(',');
    const break_time_applicable = shiftTimes.length >= 4;
    const shift_ended = shiftTimes[shiftTimes.length - 1] !== "MISSING";
    
    const reversedList = reverseListWithCurrentTime(shiftTimes);
    const copyReversedList = [...reversedList];
    
    const breakTimeData = calculateBreakTime(copyReversedList);
    const totalShiftMs = calculateTotalHours(reversedList);
    
    // Convert milliseconds to hours, minutes
    const totalHours = Math.floor(totalShiftMs / (1000 * 60 * 60));
    const totalMinutes = Math.floor((totalShiftMs / (1000 * 60)) % 60);
    const totalSeconds = Math.floor((totalShiftMs / 1000) % 60);

    return {
      totalHours,
      totalMinutes,
      totalSeconds,
      totalBreak: formatTime(breakTimeData.total_break_time),
      lunchBreak: formatTime(breakTimeData.lunch_break),
      otherBreak: formatTime(breakTimeData.other_break),
      breakTimeApplicable: break_time_applicable,
      shiftEnded: shift_ended
    };
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
    
    try {
      const result = calculateTimes(inputValueFormatted);
      
      setDataLoaded(true);
      setCurrentHour(result.totalHours);
      setCurrentMinutes(result.totalMinutes);
      setCurrentSeconds(result.totalSeconds);
      setTotalBreak(result.totalBreak);
      setLunchBreak(result.lunchBreak);
      setOtherBreak(result.otherBreak);
      setBreakTimeApplicable(result.breakTimeApplicable);
      setShiftEnded(result.shiftEnded);
      setShowInfo(true);
      
      // Set responseData in the format expected by your Cards component
      setResponseData([
        result.totalHours,
        result.totalMinutes,
        result.totalSeconds,
        result.totalBreak,
        result.lunchBreak,
        result.otherBreak,
        result.breakTimeApplicable ? "True" : "False",
        result.shiftEnded ? "True" : "False"
      ]);
    } catch (error) {
      setDataLoaded(true);
      setBreakTimeApplicable(false);
      console.error("Error:", error);
    }
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
      <ToggleSelector
        key={"default-editor"}
        onTabChange={toggleView}
        tabs={["Default", "Select"]}
        right={"0px"}
        selectedTab={
          JSON.parse(localStorage.getItem("useDefault")) ? "default" : "select"
        }
      />
      <ToggleSelector
        key={"view-editor"}
        onTabChange={toggleView}
        tabs={["All", "Canvas"]}
        selectedTab={
          JSON.parse(localStorage.getItem("view")) ? "canvas" : "all"
        }
      />
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