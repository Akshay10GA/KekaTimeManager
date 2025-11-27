import { useEffect, useState } from "react";
import ProgressBar from "../components/ProgressBar/ProgressBar";
import Cards from "../components/Cards/Cards";
import TimeInput from "../components/TimeInput/TimeInput";
import CalculateButton from "../components/CalculateButton/CalculateButton";
import NewQuiz from "../components/Quiz/NewQuiz";
import "./KekaTimeManager.css";

const STORAGE_KEY = "keka_input_time";
const DATE_KEY = "keka_input_date";

const KekaTimeManager = ({ showKekaCalculator, showQuiz, setShowQuiz }) => {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  
  // Shift Data State
  const [shiftData, setShiftData] = useState({
    breakTimeApplicable: true,
    shiftEnded: false,
    totalBreak: "00:00:00",
    lunchBreak: "00:00:00",
    otherBreak: "00:00:00",
    responseData: null,
  });

  // Time State
  const [currentTime, setCurrentTime] = useState({ h: 0, m: 0, s: 0 });
  const [estimateFinishTime, setEstimateFinishTime] = useState("");

  // --- PERSISTENCE LOGIC START ---
  const [inputValue, setInputValue] = useState(() => {
    // 1. Try to get saved data
    const savedTime = localStorage.getItem(STORAGE_KEY);
    const savedDate = localStorage.getItem(DATE_KEY);
    const today = new Date().toDateString();

    // 2. Return saved time ONLY if it belongs to today
    if (savedTime && savedDate === today) {
      return savedTime;
    }
    return "";
  });

  // 3. Save to storage whenever input changes
  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, inputValue);
    localStorage.setItem(DATE_KEY, today);
  }, [inputValue]);
  // --- PERSISTENCE LOGIC END ---

  const formatTime = (ms) => {
    if (!ms) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const calculateTimes = (shiftTimesStr) => {
    const now = new Date();
    const timeStrs = shiftTimesStr.split(',');
    
    // Parse times
    const timestamps = timeStrs.map(str => {
      if (str === "MISSING") return new Date();
      const [time, period] = str.split(' ');
      const [h, m, s] = time.split(':').map(Number);
      let hour = h;
      if (period === 'PM' && h !== 12) hour += 12;
      if (period === 'AM' && h === 12) hour = 0;
      const d = new Date(now);
      d.setHours(hour, m, s);
      return d;
    }).sort((a, b) => a - b);

    // Calculate worked time & breaks
    let totalMs = 0;
    const breakDiffs = [];
    
    for (let i = 0; i < timestamps.length - 1; i += 2) {
      totalMs += timestamps[i + 1] - timestamps[i];
      if (i + 2 < timestamps.length) {
        breakDiffs.push(timestamps[i + 2] - timestamps[i + 1]);
      }
    }

    const totalBreakMs = breakDiffs.reduce((a, b) => a + b, 0);
    const maxBreakMs = Math.max(0, ...breakDiffs);

    const totalHours = Math.floor(totalMs / 3600000);
    const totalMinutes = Math.floor((totalMs % 3600000) / 60000);
    const totalSeconds = Math.floor((totalMs % 60000) / 1000);

    return {
      h: totalHours, m: totalMinutes, s: totalSeconds,
      totalBreak: formatTime(totalBreakMs),
      lunchBreak: formatTime(maxBreakMs),
      otherBreak: formatTime(totalBreakMs - maxBreakMs),
      breakTimeApplicable: timeStrs.length >= 4,
      shiftEnded: timeStrs[timeStrs.length - 1] !== "MISSING"
    };
  };

  const handleSubmit = () => {
    if (!inputValue.trim()) return;
    
    setDataLoaded(false);
    setEstimateFinishTime("");
    
    try {
      const formattedInput = inputValue.trim().replace(/AM /g, "AM,").replace(/PM /g, "PM,");
      const res = calculateTimes(formattedInput);

      setCurrentTime({ h: res.h, m: res.m, s: res.s });
      setShiftData({
        breakTimeApplicable: res.breakTimeApplicable,
        shiftEnded: res.shiftEnded,
        totalBreak: res.totalBreak,
        lunchBreak: res.lunchBreak,
        otherBreak: res.otherBreak,
        responseData: [res.h, res.m, res.s, res.totalBreak, res.lunchBreak, res.otherBreak]
      });
      setShowInfo(true);
      setTimeout(() => setDataLoaded(true), 1500); 
    } catch (error) {
      console.error(error);
      setDataLoaded(true);
      setShiftData(prev => ({ ...prev, breakTimeApplicable: false }));
    }
  };

  // Timer Logic
  useEffect(() => {
    if (shiftData.shiftEnded || !showInfo) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        let { h, m, s } = prev;
        s++;
        if (s >= 60) { s = 0; m++; }
        if (m >= 60) { m = 0; h++; }
        return { h, m, s };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [shiftData.shiftEnded, showInfo]);

  // Estimate Finish Time Logic
  useEffect(() => {
    if (!showInfo || shiftData.shiftEnded || currentTime.h >= 9) {
      if (currentTime.h >= 9) setEstimateFinishTime("9 Hr Completed");
      return;
    }

    const remainingMinutes = (9 * 60) - (currentTime.h * 60 + currentTime.m);
    if (remainingMinutes > 0) {
      const finish = new Date();
      finish.setMinutes(finish.getMinutes() + remainingMinutes);
      setEstimateFinishTime(finish.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setEstimateFinishTime("9 Hr Completed");
    }
  }, [currentTime.h, currentTime.m, showInfo, shiftData.shiftEnded]);

  useEffect(() => {
    const handleEnter = (e) => e.key === "Enter" && handleSubmit();
    document.addEventListener("keydown", handleEnter);
    return () => document.removeEventListener("keydown", handleEnter);
  }, [inputValue]);

  const totalHoursDecimal = currentTime.h + (currentTime.m / 60);

  return (
    <>
      {!dataLoaded && (
        <div className="logo-row">
          <img src="/Leaf_logo.png" alt="Logo" className="logo-bounce" />
          <img src="/Leaf_logo.png" alt="Logo" className="logo-bounce delay1" />
          <img src="/Leaf_logo.png" alt="Logo" className="logo-bounce delay2" />
          <img src="/Leaf_logo.png" alt="Logo" className="logo-bounce delay3" />
        </div>
      )}
      
      {showKekaCalculator && (
        <div className={!dataLoaded ? "loader-active" : ""}>
          <ProgressBar hoursCompleted={totalHoursDecimal} />
          <br /><br /><br />
          <Cards
            showInfo={showInfo}
            shiftEnded={shiftData.shiftEnded}
            responseData={shiftData.responseData}
            currentTime={currentTime}
            estFinishTime={estimateFinishTime}
            breakData={shiftData}
          />
          {showQuiz ? (
            <NewQuiz setShowQuiz={setShowQuiz} />
          ) : (
            <>
              {/* Pass inputValue and setInputValue explicitly */}
              <TimeInput 
                value={inputValue} 
                onInputChange={(e) => setInputValue(e.target.value)} 
              />
              <CalculateButton onCalculate={handleSubmit} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default KekaTimeManager;