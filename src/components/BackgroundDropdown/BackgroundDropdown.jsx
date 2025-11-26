import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { Backgrounds } from "../../Background";

const BackgroundDropdown = ({theme, useDefaultBackground, refresh, setRefresh}) => {

  const changeBackground = (newTheme) => {
    const theme = localStorage.getItem("canvasTheme");
    if (theme != newTheme) {
      localStorage.setItem("canvasTheme", newTheme);
      setRefresh((refresh) => !refresh);
    }
  };

  return (
    <FormControl fullWidth variant="outlined" sx={{ minWidth: 200 }}>
      <InputLabel sx={{ color: "white" }}>Choose option</InputLabel>

      <Select
        value={localStorage.getItem("canvasTheme", "")}
        onChange={((e) => changeBackground(e.target.value))}
        label="Choose option"
        disabled={useDefaultBackground}
        sx={{
          color: "white",
          bgcolor: "#3f3f3f", // grey background
          borderRadius: "6px",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "white",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#ddd",
          },
          "&.Mui-disabled": {
            opacity: 0.5,
          },
          ".MuiSvgIcon-root": { color: "white" }, // dropdown arrow
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              bgcolor: "#3f3f3f", // dropdown menu background
              color: "white", // menu item text
              "& .MuiMenuItem-root:hover": {
                bgcolor: "#4a4a4a",
              },
            },
          },
        }}
      >
        {Object.entries(Backgrounds).map(([key, val]) => (
          <MenuItem key={val} value={val}>
            {key}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default BackgroundDropdown;
