import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import Cards from "../components/Cards/Cards";
import TimeInput from "../components/TimeInput/TimeInput";
import CalculateButton from "../components/CalculateButton/CalculateButton";
import "./KekaTimeManager.css";
import ToggleSelector from "../components/ToggleSelector/ToggleSelector";
import { Backgrounds } from "../Background";
import NewQuiz from "../components/Quiz/NewQuiz";

const KekaTimeManager = ({refresh, setRefresh, showKekaCalculator, setShowKekaCalculator, showQuiz, setShowQuiz}) => {
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

  useEffect(() => {
      localStorage.setItem("view", showKekaCalculator);
  },[showKekaCalculator]);

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
    // Convert hours and minutes to decimal hours (e.g., 8h 45m = 8.75)
    const totalHoursDecimal = currentHour + (currentMinutes / 60);
    var completedPercentage = (totalHoursDecimal / 9) * 100 + "%";
    r.style.setProperty("--bar-percentage", completedPercentage);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleEnterPress);
    if (estimateFinishTime == "" && (currentHour > 0 || currentMinutes > 0) && !shiftEnded) {
      // Calculate remaining time to reach 9 hours
      const remainingMinutes = (9 * 60) - (currentHour * 60 + currentMinutes);
      
      if (remainingMinutes > 0) {
        // Add remaining minutes to current time
        const finishTime = new Date();
        finishTime.setMinutes(finishTime.getMinutes() + remainingMinutes);
        
        let estFinishHour = finishTime.getHours();
        if (estFinishHour > 12) estFinishHour -= 12;
        if (estFinishHour === 0) estFinishHour = 12;
        
        const estFinishMinute = finishTime.getMinutes();
        const period = finishTime.getHours() >= 12 ? 'PM' : 'AM';
        
        setEstFinishHourNow(`${estFinishHour}:${estFinishMinute.toString().padStart(2, '0')} ${period}`);
        setEstimateFinishTime(`${estFinishHour}:${estFinishMinute.toString().padStart(2, '0')} ${period}`);
      } else {
        setEstFinishHourNow(`9 Hr Completed`);
        setEstimateFinishTime(`9 Hr Completed`);
      }
    } else if (currentHour >= 9) {
      setEstFinishHourNow(`9 Hr Completed`);
    }

    let element25 = document.getElementById("25per");
    let element50 = document.getElementById("50per");
    let element75 = document.getElementById("75per");
    let element100 = document.getElementById("100per");

    if (element25 && element50 && element75 && element100) {
      // Convert to decimal hours properly (e.g., 2h 15m = 2.25)
      const totalHoursDecimal = currentHour + (currentMinutes / 60);
      
      totalHoursDecimal >= 2.25
        ? element25.classList.add("active")
        : element25.classList.remove("active");
      totalHoursDecimal >= 4.5
        ? element50.classList.add("active")
        : element50.classList.remove("active");
      totalHoursDecimal >= 6.75
        ? element75.classList.add("active")
        : element75.classList.remove("active");
      totalHoursDecimal >= 9
        ? element100.classList.add("active")
        : element100.classList.remove("active");
    }

    let timeNow = new Date();
    if (timeNow.getHours() > 12) {
      setRunningHour(timeNow.getHours() - 12);
    } else {
      setRunningHour(timeNow.getHours());
    }
    setRunningMinutes(timeNow.getMinutes());
    setRunningSeconds(timeNow.getSeconds());
    
    // Only run timer if shift hasn't ended and we have data
    let timer;
    if (!shiftEnded && showInfo) {
      timer = setTimeout(() => {
        setCurrentSeconds((prevSeconds) => {
          const newSeconds = prevSeconds + 1;
          if (newSeconds >= 60) {
            setCurrentMinutes((prevMinutes) => {
              const newMinutes = prevMinutes + 1;
              if (newMinutes >= 60) {
                setCurrentHour((prevHour) => prevHour + 1);
                return 0;
              }
              return newMinutes;
            });
            return 0;
          }
          return newSeconds;
        });
      }, 1000);
    }
    
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
      {showKekaCalculator && (
        <div className={`${!dataLoaded ? "loader-active" : ""}`} >
          <ProgressBar /> <br /> <br /> <br />
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
          {showQuiz ? (
            <NewQuiz setShowQuiz={setShowQuiz}/>
          ) : (
            <>
              <TimeInput onInputChange={handleChange} />
              <CalculateButton onCalculate={handleSubmit} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default KekaTimeManager;