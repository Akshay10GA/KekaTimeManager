import React, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";

const JotFormPopup = ({ open, onClose }) => {
  const formRef = useRef(null);
  const [notLoaded, setNotLoaded] = useState(true)

  useEffect(() => {
    if (open && formRef.current && notLoaded) {
      console.log("Loading");
      
      // Remove previous form if exists
      formRef.current.innerHTML = "";

      // Load JotForm script
      const script = document.createElement("script");
      script.src = "https://form.jotform.com/jsform/253282743665464";
      script.async = true;
      formRef.current.appendChild(script);
      setNotLoaded(false)
    }
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Feedback Form (Experimental)
        <IconButton onClick={() => {onClose();setNotLoaded(true)}}>
          X
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0, minHeight: 600 }}>
        <div ref={formRef} />
      </DialogContent>
    </Dialog>
  );
};

export default JotFormPopup;
