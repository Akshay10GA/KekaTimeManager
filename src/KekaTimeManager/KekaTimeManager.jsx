import { useEffect, useState } from "react";
import "./KekaTimeManager.css";

const STORAGE_KEY = "keka_input_time";
const DATE_KEY = "keka_input_date";

const KekaTimeManager = () => {
  const [dataLoaded, setDataLoaded] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  
  const [shiftData, setShiftData] = useState({
    breakTimeApplicable: true,
    shiftEnded: false,
    totalBreak: "00:00:00",
    lunchBreak: "00:00:00",
    otherBreak: "00:00:00",
    responseData: null,
  });

  const [currentTime, setCurrentTime] = useState({ h: 0, m: 0, s: 0 });
  const [estimateFinishTime, setEstimateFinishTime] = useState("");

  const [inputValue, setInputValue] = useState(() => {
    const savedTime = localStorage.getItem(STORAGE_KEY);
    const savedDate = localStorage.getItem(DATE_KEY);
    const today = new Date().toDateString();
    return (savedTime && savedDate === today) ? savedTime : "";
  });

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem(STORAGE_KEY, inputValue);
    localStorage.setItem(DATE_KEY, today);
  }, [inputValue]);

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

    return {
      h: Math.floor(totalMs / 3600000), 
      m: Math.floor((totalMs % 3600000) / 60000), 
      s: Math.floor((totalMs % 60000) / 1000),
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
        responseData: [res.h, res.m, res.s]
      });
      setShowInfo(true);
      setTimeout(() => setDataLoaded(true), 800); 
    } catch (error) {
      console.error(error);
      setDataLoaded(true);
    }
  };

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

  useEffect(() => {
    if (!showInfo || shiftData.shiftEnded || currentTime.h >= 9) {
      if (currentTime.h >= 9) setEstimateFinishTime("9 HR COMPLETED");
      return;
    }
    const remainingMinutes = (9 * 60) - (currentTime.h * 60 + currentTime.m);
    if (remainingMinutes > 0) {
      const finish = new Date();
      finish.setMinutes(finish.getMinutes() + remainingMinutes);
      setEstimateFinishTime(finish.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    } else {
      setEstimateFinishTime("9 HR COMPLETED");
    }
  }, [currentTime.h, currentTime.m, showInfo, shiftData.shiftEnded]);

  const handleEnter = (e) => e.key === "Enter" && handleSubmit();
  
  const totalHoursDecimal = currentTime.h + (currentTime.m / 60);
  const progressPercent = Math.min((totalHoursDecimal / 9) * 100, 100).toFixed(1);
  const isOvertime = currentTime.h >= 9;

  return (
    <div className={`terminal-wrapper ${!dataLoaded ? "processing" : ""}`}>
      
      {/* 1. INPUT TERMINAL (Always at the top for easy access) */}
      <div className="widget terminal-input-widget mb-4">
        <div className="widget-header">TIME LOG INPUT // PASTE RAW KEKA DATA</div>
        <div className="terminal-prompt-container">
          <span className="prompt-symbol">{">"}</span>
          <input
            type="text"
            className="terminal-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Paste your clock-in/out times here..."
            autoFocus
          />
          <button className="execute-btn" onClick={handleSubmit}>CALCULATE</button>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD GRID */}
      <div className="trading-grid">
        
        {/* Progress Widget */}
        <div className="widget highlight-widget">
          <div className="widget-header">SHIFT PROGRESS // 9 HOUR TARGET</div>
          <div className="progress-value-large">
            {currentTime.h.toString().padStart(2, '0')}:
            {currentTime.m.toString().padStart(2, '0')}:
            {currentTime.s.toString().padStart(2, '0')}
          </div>
          <div className="progress-bar-bg">
            <div 
              className={`progress-bar-fill ${isOvertime ? 'overtime' : ''}`} 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="progress-metrics">
            <span>{progressPercent}% LOGGED</span>
            <span>{isOvertime ? 'OVERTIME ACTIVE' : 'IN PROGRESS'}</span>
          </div>
        </div>

        {/* Shift Details Widget */}
        <div className="widget">
          <div className="widget-header">SHIFT DETAILS</div>
          <div className="stat-row">
            <span className="stat-key">REMAINING TIME</span>
            <span className={`stat-val ${isOvertime ? 'alert' : ''}`}>
              {isOvertime ? "00:00" : `${8 - currentTime.h}h ${60 - currentTime.m}m`}
            </span>
          </div>
          <div className="stat-row">
            <span className="stat-key">EST. FINISH TIME</span>
            <span className="stat-val accent">{estimateFinishTime || "--:--"}</span>
          </div>
          <div className="stat-row">
            <span className="stat-key">SHIFT STATUS</span>
            <span className="stat-val">{shiftData.shiftEnded ? "ENDED" : "ACTIVE"}</span>
          </div>
        </div>

        {/* Break Details Widget */}
        <div className="widget">
          <div className="widget-header">BREAK BREAKDOWN</div>
          {shiftData.breakTimeApplicable ? (
            <div className="analytics-list">
              <div className="stat-row">
                <span className="stat-key">TOTAL BREAK</span>
                <span className="stat-val warning">{shiftData.totalBreak}</span>
              </div>
              <div className="stat-row">
                <span className="stat-key">LUNCH BREAK</span>
                <span className="stat-val">{shiftData.lunchBreak}</span>
              </div>
              <div className="stat-row">
                <span className="stat-key">OTHER BREAKS</span>
                <span className="stat-val">{shiftData.otherBreak}</span>
              </div>
            </div>
          ) : (
            <div className="terminal-log alert-text" style={{marginTop: '20px', textAlign: 'center'}}>
              [NO BREAK DATA LOGGED]
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default KekaTimeManager;