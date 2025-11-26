import { Box } from "@mui/material";

const HamburgerMenu = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      className="hamburger-menu"
      sx={{
        position: "fixed",
        top: 16,
        left: 16,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 1,
        cursor: "pointer",
      }}
    >
      {/* Hamburger Icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>

      {/* Menu Text */}
      <Box component="span" sx={{ color: "white", fontWeight: 500, fontSize: 16 }}>
        Menu
      </Box>
    </Box>
  );
};

export default HamburgerMenu;
