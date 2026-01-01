import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
import BackgroundDropdown from "../BackgroundDropdown/BackgroundDropdown";
import JotFormPopup from "../JotForm/JotFormPopup";
import "./MenuDialog.css";

const MenuDialog = ({
  open,
  onClose,
  refresh,
  setRefresh,
  showKekaCalculator,
  setShowKekaCalculator,
  useDefaultBackground,
  setUseDefaultBackground,
  setShowQuiz,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showReloadNote, setShowReloadNote] = useState(false);
  const [openJotForm, setOpenJotForm] = useState(false);

  /* ---------------- CLOCK ---------------- */
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  /* ---------------- STATE HYDRATION ---------------- */
  // Restore Canvas Only Mode on first mount
  useEffect(() => {
    const stored = localStorage.getItem("showKekaCalculator");
    if (stored !== null) {
      setShowKekaCalculator(JSON.parse(stored));
    }
  }, [setShowKekaCalculator]);

  const handleCanvasOnlyToggle = () => {
    const next = !showKekaCalculator;
    setShowKekaCalculator(next);
    localStorage.setItem("showKekaCalculator", JSON.stringify(next));
  };

  const handleSetUseDefaultBackground = (value) => {
    setUseDefaultBackground(value);
    localStorage.setItem("useDefault", JSON.stringify(value));
    setShowReloadNote(true);
  };

  return (
    <>
      <JotFormPopup open={openJotForm} onClose={() => setOpenJotForm(false)} />

      <Dialog
        open={open}
        onClose={onClose}
        className="menu-glass-dialog"
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          <div className="menu-content-row">
            {/* LEFT PANEL — CLOCK */}
            <div className="clock-panel">
              {formatTime(currentTime)}
            </div>

            {/* RIGHT PANEL — OPTIONS */}
            <div className="menu-options-panel joyride-menu-dialog">

              {/* Canvas Only Mode */}
              <div className="menu-item">
                <div className="menu-label">
                  Canvas Only Mode
                  <span className="menu-shortcut">Ctrl + M</span>
                </div>
                <Switch
                  checked={!showKekaCalculator}
                  onChange={handleCanvasOnlyToggle}
                  color="secondary"
                />
              </div>

              {/* Default Background */}
              <div
                className="menu-item"
                style={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div className="menu-label">
                    Show default background
                    <Tooltip title="Automatically apply themed backgrounds during festivals and special occasions">
                      <IconButton
                        size="small"
                        sx={{ color: "rgba(255,255,255,0.6)" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </IconButton>
                    </Tooltip>
                  </div>

                  <Switch
                    checked={useDefaultBackground}
                    onChange={() =>
                      handleSetUseDefaultBackground(!useDefaultBackground)
                    }
                    color="secondary"
                  />
                </div>

                {showReloadNote && (
                  <div className="reload-note">
                    May require reloading to take effect
                  </div>
                )}
              </div>

              {/* Background Selector */}
              <div className="menu-item">
                <BackgroundDropdown
                  useDefaultBackground={useDefaultBackground}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />
              </div>

              {/* Quiz */}
              {/* <div
                className="menu-item quiz-item"
                onClick={() => {
                  onClose();
                  setShowQuiz(true);
                }}
              >
                <div className="menu-label">
                  Take a Quiz?
                  <span className="menu-shortcut">Ctrl + Q</span>
                </div>
              </div> */}

              {/* Feedback */}
              <div
                className="menu-item feedback-item"
                onClick={() => setOpenJotForm(true)}
              >
                <div className="menu-label">
                  Suggestions or Feedback
                </div>
              </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuDialog;
