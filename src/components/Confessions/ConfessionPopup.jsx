import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  CircularProgress
} from "@mui/material";
import { supabase } from "../../supabaseClient";

// "Hidden" storage key for daily limit
const STORAGE_KEY_HIDDEN = "keka_sys_pref_log_v2";

const ConfessionPopup = ({ open, onClose }) => {
  const [confession, setConfession] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Check daily limit on mount
  useEffect(() => {
    if (open) {
      checkDailyLimit();
      fetchConfessions();
    }
  }, [open]);

  const checkDailyLimit = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY_HIDDEN);
      if (storedData) {
        // Decode the "hidden" data (Base64)
        const jsonStr = atob(storedData); 
        const { last_entry_date } = JSON.parse(jsonStr);
        const today = new Date().toDateString();
        
        if (last_entry_date === today) {
          setLimitReached(true);
        } else {
          setLimitReached(false);
        }
      }
    } catch (e) {
      console.error("System pref error", e);
    }
  };

  const setDailyLimit = () => {
    const today = new Date().toDateString();
    const data = JSON.stringify({ 
      last_entry_date: today, 
      sys_id: Math.random().toString(36).substring(7) 
    });
    localStorage.setItem(STORAGE_KEY_HIDDEN, btoa(data));
    setLimitReached(true);
  };

  // --- PROFANITY FILTER LOGIC ---
  const filterProfanity = (text) => {
    // 1. Define the blocklist
    const badWords = [
      // User specific
      "porn", "sex", "boobs", "boob", "dick", "pussy", "mastrubation", "masturbation",
      "gdtc", "go digital", "godigital",
      // Common Profanity
      "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "whore", "slut", 
      "rape", "damn", "cock", "suck", "nigger", "fag", "dyke", "retard", "piss"
    ];

    let cleanedText = text;

    // 2. Iterate and replace
    // We sort by length descending so "go digital" is caught before "go" (if "go" was banned)
    badWords.sort((a, b) => b.length - a.length).forEach((word) => {
      // Create a regex that is global (g) and case-insensitive (i)
      // We generally want word boundaries (\b) to avoid replacing parts of innocent words (e.g., "class" -> "cl***")
      // However, for spaced words like "go digital", boundaries work on the start/end.
      
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleanedText = cleanedText.replace(regex, "***");
      
      // OPTIONAL: simple "smart" check for spacing evasion (e.g. "p o r n")
      // This is aggressive and might have false positives, but helps with "smart" players.
      if (word.length > 3 && !word.includes(" ")) {
        const spacedWord = word.split("").join("\\s+"); // p\s+o\s+r\s+n
        const spacedRegex = new RegExp(spacedWord, "gi");
        cleanedText = cleanedText.replace(spacedRegex, "***");
      }
    });

    return cleanedText;
  };

  const fetchConfessions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) console.error("Error fetching:", error);
    else setMessages(data || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!confession.trim()) return;
    if (limitReached) return;

    setSending(true);
    setErrorMsg("");

    // Apply Filter Here
    const cleanConfession = filterProfanity(confession);

    const { error } = await supabase
      .from("confessions")
      .insert([{ content: cleanConfession }]);

    if (error) {
      setErrorMsg("Failed to send. Try again.");
    } else {
      setConfession("");
      setDailyLimit();
      fetchConfessions();
    }
    setSending(false);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        style: {
          backgroundColor: "rgba(30, 30, 30, 0.95)",
          color: "white",
          borderRadius: "15px",
          border: "1px solid #444"
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Anonymous Confessions</span>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          {limitReached ? (
            <Typography 
              variant="body2" 
              sx={{ color: '#ffab40', textAlign: 'center', p: 2, border: '1px dashed #ffab40', borderRadius: 1 }}
            >
              You have used your confession limit for today. Come back tomorrow!
            </Typography>
          ) : (
            <>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Type your confession here..."
                variant="outlined"
                value={confession}
                onChange={(e) => setConfession(e.target.value)}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  input: { color: 'white' },
                  textarea: { color: 'white' },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#555' },
                    '&:hover fieldset': { borderColor: '#888' },
                    '&.Mui-focused fieldset': { borderColor: '#f78900' },
                  }
                }}
              />
              <Typography variant="caption" sx={{ color: '#777', mt: 0.5, display: 'block' }}>
                Note: Inappropriate language will be censored.
              </Typography>
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 1, bgcolor: '#f78900', '&:hover': { bgcolor: '#d67600' } }}
                onClick={handleSubmit}
                disabled={sending || !confession.trim()}
              >
                {sending ? "Posting..." : "Confess"}
              </Button>
              {errorMsg && <Typography color="error" variant="caption">{errorMsg}</Typography>}
            </>
          )}
        </Box>

        <Divider sx={{ bgcolor: '#555', mb: 2 }} />
        
        <Typography variant="h6" sx={{ fontSize: '1rem', mb: 1, color: '#aaa' }}>
          Recent Confessions
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} sx={{ color: '#f78900' }} />
          </Box>
        ) : (
          <List sx={{ maxHeight: '300px', overflow: 'auto' }}>
            {messages.length === 0 ? (
              <Typography variant="body2" color="#777" align="center">No confessions yet.</Typography>
            ) : (
              messages.map((msg) => (
                <ListItem key={msg.id} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 1, borderRadius: 1 }}>
                  <ListItemText 
                    primary={msg.content} 
                    secondary={new Date(msg.created_at).toLocaleString()}
                    primaryTypographyProps={{ style: { color: '#e0e0e0', wordBreak: 'break-word' } }}
                    secondaryTypographyProps={{ style: { color: '#666', fontSize: '0.75rem' } }}
                  />
                </ListItem>
              ))
            )}
          </List>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConfessionPopup;
