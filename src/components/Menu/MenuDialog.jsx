import React, { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Switch,
  Tooltip,
} from "@mui/material";
import BackgroundDropdown from "../BackgroundDropdown/BackgroundDropdown";
import JotFormPopup from "../JotForm/JotFormPopup";

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
  const [openJotForm, setOpenJotForm] = useState(false)

  // Clock updater
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format HH:MM:SS
  const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  };

  // Handle toggle + show reload notice
  const handleSetUseDefaultBackground = (value) => {
    setUseDefaultBackground(value);
    localStorage.setItem("useDefault", JSON.stringify(value));

    setShowReloadNote(true); // ← Display reload note
  };

  const menuItemStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "50px",
  };

  const hoverPulseStyle = {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    borderRadius: "8px",
    transition: "0.2s ease",
    "@keyframes textGlow": {
      "0%": { transform: "scale(1)", textShadow: "0 0 0 transparent" },
      "50%": {
        transform: "scale(1.05)",
        textShadow: "0 0 16px rgba(255,255,255,0.9)",
        padding: "0 10px",
      },
      "100%": {
        transform: "scale(1)",
        textShadow: "0 0 0 transparent",
      },
    },
    "&:hover": { animation: "textGlow 1.2s ease-in-out infinite" },
  };

  return (
    <>
    <JotFormPopup open={openJotForm} onClose={()=>setOpenJotForm(false)}/>
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: "#343434",
          color: "white",
          borderRadius: 2,
          minWidth: 650,
          maxWidth: "90vw",
          p: 2,
        },
      }}
    >
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "stretch", // Makes clock and menu same height
          }}
        >
          {/* LEFT PANEL — DIGITAL CLOCK */}
          <Box
            sx={{
              flex: "0 0 180px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "#2c2c2c",
              borderRadius: 2,
              p: 2,
              color: "#00ff00",
              fontFamily: "monospace",
              fontSize: "4rem",
              textAlign: "center",
              animation: "pulseGlow 1.5s ease-in-out infinite",
              "@keyframes pulseGlow": {
                "0%, 100%": { textShadow: "0 0 6px #00ff00" },
                "50%": { textShadow: "0 0 22px #00ff00" },
              },
            }}
          >
            {formatTime(currentTime)}
          </Box>

          {/* RIGHT PANEL — MENU ITEMS */}
          <Box
            sx={{
              flex: 1,
              p: 1,
              borderRadius: 1,
              fontSize: "1.3rem",
              bgcolor: "#3f3f3f",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              "& > *": {
                height: "50px",
              },
            }}
            className="joyride-menu-dialog"
          >
            {/* Canvas Only Mode */}
            <Box sx={menuItemStyle}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>Canvas Only Mode</span>
                <span style={{ opacity: 0.7, fontSize: "0.75rem" }}>
                  (Ctrl + M)
                </span>
              </Box>

              <Switch
                checked={!showKekaCalculator}
                onChange={() => setShowKekaCalculator(!showKekaCalculator)}
                color="primary"
              />
            </Box>

            {/* Default Background */}
            <Box
              sx={{
                ...menuItemStyle,
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <span>Show default background</span>
                  <Tooltip title="Automatically apply themed backgrounds during festivals and special occasions">
                    <IconButton size="small">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ cursor: "pointer" }}
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                      </svg>
                    </IconButton>
                  </Tooltip>
                </Box>

                <Switch
                  checked={useDefaultBackground}
                  onChange={() =>
                    handleSetUseDefaultBackground(!useDefaultBackground)
                  }
                  color="primary"
                />
              </Box>

              {/* RELOAD NOTE */}
              {showReloadNote && (
                <Box
                  sx={{
                    mt: -1,
                    fontSize: "0.9rem",
                    opacity: 0.8,
                    color: "#ce2929ff",
                    textShadow: "0 0 1px rgba(240, 4, 4, 0.9)",
                    animation: "fadeIn 0.4s ease",
                    "@keyframes fadeIn": {
                      from: { opacity: 0 },
                      to: { opacity: 0.8 },
                    },
                  }}
                >
                  May require reloading to take effect
                </Box>
              )}
            </Box>
            <BackgroundDropdown
              useDefaultBackground={useDefaultBackground}
              refresh={refresh}
              setRefresh={setRefresh}
            />

            {/* Quiz Button */}
            <Box
              className="quiz-button"
              sx={hoverPulseStyle}
              onClick={() => {
                onClose();
                setShowQuiz(true);
              }}
            >
              <span>Take a Quiz?</span>
              <span style={{ opacity: 0.7, fontSize: "0.75rem" }}>
                (Ctrl + Q)
              </span>
            </Box>
            <Box
              className="suggestion-feedback-button"
              sx={{cursor: "pointer"}}
              onClick={() => {
                setOpenJotForm(true)
              }}
            >
              <span>Suggestions or Feedback</span>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default MenuDialog;
