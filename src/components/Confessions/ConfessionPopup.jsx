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
  CircularProgress,
  DialogActions
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

  // Admin State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Check daily limit on mount
  useEffect(() => {
    if (open) {
      checkDailyLimit();
      fetchConfessions();
    } else {
        // Reset admin state when closed for security
        setIsAdmin(false);
        setPasskeyInput("");
    }
  }, [open]);

  const checkDailyLimit = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY_HIDDEN);
      if (storedData) {
        const jsonStr = atob(storedData); 
        const { last_entry_date } = JSON.parse(jsonStr);
        const today = new Date().toDateString();
        setLimitReached(last_entry_date === today);
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

  const filterProfanity = (text) => {
    const badWords = [
      "porn", "sex", "boobs", "boob", "dick", "pussy", "mastrubation", "masturbation",
      "gdtc", "go digital", "godigital",
      "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "whore", "slut", 
      "rape", "damn", "cock", "suck", "nigger", "fag", "dyke", "retard", "piss"
    ];

    let cleanedText = text;
    badWords.sort((a, b) => b.length - a.length).forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleanedText = cleanedText.replace(regex, "***");
      
      if (word.length > 3 && !word.includes(" ")) {
        const spacedWord = word.split("").join("\\s+");
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
      .limit(50); // Increased limit for admin visibility

    if (error) console.error("Error fetching:", error);
    else setMessages(data || []);
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!confession.trim()) return;
    if (limitReached && !isAdmin) return; // Admins bypass limit

    setSending(true);
    setErrorMsg("");

    const cleanConfession = filterProfanity(confession);

    const { error } = await supabase
      .from("confessions")
      .insert([{ content: cleanConfession }]);

    if (error) {
      setErrorMsg("Failed to send. Try again.");
    } else {
      setConfession("");
      if (!isAdmin) setDailyLimit();
      fetchConfessions();
    }
    setSending(false);
  };

  // --- ADMIN LOGIC ---
  const handleAdminLogin = () => {
    const envPasskey = import.meta.env.VITE_ADMIN_PASSKEY;
    if (passkeyInput === envPasskey) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPasskeyInput("");
    } else {
      alert("Incorrect Passkey");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this confession?")) return;

    const { error } = await supabase
      .from("confessions")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Error deleting: " + error.message);
    } else {
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
    }
  };

  return (
    <>
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
            <Box display="flex" alignItems="center" gap={1}>
                <span>Anonymous Confessions</span>
                {/* Admin Toggle Button (Lock Icon) */}
                <IconButton 
                    size="small" 
                    onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
                    sx={{ color: isAdmin ? '#f78900' : '#555' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isAdmin ? (
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" /> // Unlocked top
                        ) : (
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" /> // Locked top
                        )}
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    </svg>
                </IconButton>
            </Box>

            <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            </IconButton>
        </DialogTitle>
        
        <DialogContent>
            {/* Input Section */}
            <Box sx={{ mb: 3 }}>
            {limitReached && !isAdmin ? (
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
                    placeholder={isAdmin ? "Post as Admin (Bypasses limit)" : "Type your confession here..."}
                    variant="outlined"
                    value={confession}
                    onChange={(e) => setConfession(e.target.value)}
                    sx={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    input: { color: 'white' },
                    textarea: { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: isAdmin ? '#f78900' : '#555' },
                        '&:hover fieldset': { borderColor: '#888' },
                        '&.Mui-focused fieldset': { borderColor: '#f78900' },
                    }
                    }}
                />
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

            {/* Feed Section */}
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
                    <ListItem 
                        key={msg.id} 
                        sx={{ 
                            bgcolor: 'rgba(255,255,255,0.05)', 
                            mb: 1, 
                            borderRadius: 1,
                            pr: isAdmin ? 5 : 2 // Make room for delete button
                        }}
                    >
                    <ListItemText 
                        primary={msg.content} 
                        secondary={new Date(msg.created_at).toLocaleString()}
                        primaryTypographyProps={{ style: { color: '#e0e0e0', wordBreak: 'break-word' } }}
                        secondaryTypographyProps={{ style: { color: '#666', fontSize: '0.75rem' } }}
                    />
                    
                    {/* Delete Button (Only for Admin) */}
                    {isAdmin && (
                        <IconButton 
                            edge="end" 
                            onClick={() => handleDelete(msg.id)}
                            sx={{ color: '#ff4444', position: 'absolute', right: 8, top: 8 }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </IconButton>
                    )}
                    </ListItem>
                ))
                )}
            </List>
            )}
        </DialogContent>
        </Dialog>

        {/* Admin Login Dialog */}
        <Dialog open={showAdminLogin} onClose={() => setShowAdminLogin(false)}>
            <DialogTitle>Admin Access</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Enter Passkey"
                    type="password"
                    fullWidth
                    variant="standard"
                    value={passkeyInput}
                    onChange={(e) => setPasskeyInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShowAdminLogin(false)}>Cancel</Button>
                <Button onClick={handleAdminLogin}>Unlock</Button>
            </DialogActions>
        </Dialog>
    </>
  );
};

export default ConfessionPopup;
