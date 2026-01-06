import React, { useState, useEffect, useMemo } from "react";
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
  DialogActions,
  Popover,
  Chip
} from "@mui/material";
import { supabase } from "../../supabaseClient";

// "Hidden" storage key for daily limit
const STORAGE_KEY_HIDDEN = "keka_sys_pref_log_v2";
// Storage key for identifying user for reactions
const STORAGE_KEY_USER_ID = "keka_confession_user_id";

// Available reactions
const EMOJIS = ['😅', '😂', '🥲', '😘', '😡', '😱', '🖕', '👍', '🍌', '🍆', '🍑'];

const ConfessionPopup = ({ open, onClose }) => {
  const [confession, setConfession] = useState("");
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState({}); // Structure: { [msgId]: { [emoji]: count, userReaction: string|null } }
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Admin State
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Reaction Popover State
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeMsgId, setActiveMsgId] = useState(null);

  // Get or Create Persistent User ID for Reactions
  const userId = useMemo(() => {
    let id = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_USER_ID, id);
    }
    return id;
  }, []);

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
    const { data: msgs, error } = await supabase
      .from("confessions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching:", error);
    } else {
      setMessages(msgs || []);
      if (msgs && msgs.length > 0) {
        await fetchReactions(msgs.map(m => m.id));
      }
    }
    setLoading(false);
  };

  const fetchReactions = async (msgIds) => {
    const { data, error } = await supabase
      .from("confession_reactions")
      .select("confession_id, reaction, user_id")
      .in("confession_id", msgIds);

    if (error) {
      console.error("Error fetching reactions:", error);
      return;
    }

    // Aggregating reactions
    const reactionMap = {};
    msgIds.forEach(id => {
      reactionMap[id] = { counts: {}, userReaction: null };
    });

    data.forEach(r => {
      if (!reactionMap[r.confession_id]) return;
      
      // Increment count
      reactionMap[r.confession_id].counts[r.reaction] = (reactionMap[r.confession_id].counts[r.reaction] || 0) + 1;
      
      // Check if this is the current user's reaction
      if (r.user_id === userId) {
        reactionMap[r.confession_id].userReaction = r.reaction;
      }
    });

    setReactions(reactionMap);
  };

  const handleReactionClick = async (msgId, emoji) => {
    setAnchorEl(null); // Close popover if open
    setActiveMsgId(null);

    const currentData = reactions[msgId] || { counts: {}, userReaction: null };
    const oldReaction = currentData.userReaction;
    const isRemoving = oldReaction === emoji;
    const newReaction = isRemoving ? null : emoji;

    // 1. Optimistic UI Update
    setReactions(prev => {
      const newState = { ...prev };
      const msgState = { ...newState[msgId], counts: { ...newState[msgId].counts } };

      // Remove old reaction count if exists
      if (oldReaction) {
        msgState.counts[oldReaction] = Math.max(0, (msgState.counts[oldReaction] || 0) - 1);
        if (msgState.counts[oldReaction] === 0) delete msgState.counts[oldReaction];
      }

      // Add new reaction count if exists
      if (newReaction) {
        msgState.counts[newReaction] = (msgState.counts[newReaction] || 0) + 1;
      }

      msgState.userReaction = newReaction;
      newState[msgId] = msgState;
      return newState;
    });

    // 2. Supabase Interaction
    try {
      if (isRemoving) {
        // DELETE
        await supabase
          .from("confession_reactions")
          .delete()
          .match({ confession_id: msgId, user_id: userId });
      } else {
        // UPSERT (Insert or Update thanks to unique constraint on confession_id + user_id)
        const { error } = await supabase
          .from("confession_reactions")
          .upsert({ 
            confession_id: msgId, 
            user_id: userId, 
            reaction: emoji 
          });
        
        if (error) throw error;
      }
    } catch (err) {
      console.error("Reaction failed:", err);
      // Revert UI on error (optional, skipping for simplicity but recommended in prod)
    }
  };

  const openReactionPopover = (event, msgId) => {
    setAnchorEl(event.currentTarget);
    setActiveMsgId(msgId);
  };

  const handleSubmit = async () => {
    if (!confession.trim()) return;
    if (limitReached && !isAdmin) return;

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
      // Cleanup reactions state
      setReactions(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
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
                <IconButton 
                    size="small" 
                    onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(true)}
                    sx={{ color: isAdmin ? '#f78900' : '#555' }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {isAdmin ? <path d="M7 11V7a5 5 0 0 1 10 0v4" /> : <path d="M7 11V7a5 5 0 0 1 10 0v4" />}
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
                messages.map((msg) => {
                    const msgReactions = reactions[msg.id] || { counts: {}, userReaction: null };
                    
                    return (
                    <ListItem 
                        key={msg.id} 
                        sx={{ 
                            bgcolor: 'rgba(255,255,255,0.05)', 
                            mb: 1, 
                            borderRadius: 1,
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            position: 'relative',
                            pr: isAdmin ? 5 : 2
                        }}
                    >
                        <ListItemText 
                            primary={msg.content} 
                            secondary={new Date(msg.created_at).toLocaleString()}
                            primaryTypographyProps={{ style: { color: '#e0e0e0', wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
                            secondaryTypographyProps={{ style: { color: '#666', fontSize: '0.75rem', marginTop: '4px' } }}
                            sx={{ width: '100%', mb: 1 }}
                        />
                        
                        {/* Reactions Bar */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                            {/* Render existing reaction counts as Chips */}
                            {Object.entries(msgReactions.counts).map(([emoji, count]) => (
                                <Chip 
                                    key={emoji}
                                    label={`${emoji} ${count}`}
                                    size="small"
                                    onClick={() => handleReactionClick(msg.id, emoji)}
                                    sx={{
                                        height: '24px',
                                        fontSize: '0.8rem',
                                        bgcolor: msgReactions.userReaction === emoji ? 'rgba(247, 137, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                                        color: msgReactions.userReaction === emoji ? '#f78900' : '#ccc',
                                        border: msgReactions.userReaction === emoji ? '1px solid #f78900' : '1px solid transparent',
                                        '&:hover': {
                                            bgcolor: msgReactions.userReaction === emoji ? 'rgba(247, 137, 0, 0.3)' : 'rgba(255,255,255,0.1)',
                                        }
                                    }}
                                />
                            ))}

                            {/* Add Reaction Button */}
                            <IconButton 
                                size="small" 
                                onClick={(e) => openReactionPopover(e, msg.id)}
                                sx={{ 
                                    color: '#777', 
                                    p: 0.5,
                                    bgcolor: 'rgba(255,255,255,0.02)',
                                    '&:hover': { color: '#f78900', bgcolor: 'rgba(255,255,255,0.05)' }
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <line x1="12" y1="8" x2="12" y2="16"></line>
                                    <line x1="8" y1="12" x2="16" y2="12"></line>
                                </svg>
                            </IconButton>
                        </Box>
                        
                        {/* Delete Button (Only for Admin) */}
                        {isAdmin && (
                            <IconButton 
                                onClick={() => handleDelete(msg.id)}
                                sx={{ color: '#ff4444', position: 'absolute', right: 4, top: 4, padding: '4px' }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </IconButton>
                        )}
                    </ListItem>
                    )
                })
                )}
            </List>
            )}
        </DialogContent>
        </Dialog>

        {/* Reaction Picker Popover */}
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => { setAnchorEl(null); setActiveMsgId(null); }}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            PaperProps={{
                sx: {
                    bgcolor: '#2a2a2a',
                    border: '1px solid #444',
                    borderRadius: 2,
                    p: 1,
                    display: 'flex',
                    gap: 1
                }
            }}
        >
            {EMOJIS.map(emoji => (
                <IconButton 
                    key={emoji} 
                    onClick={() => handleReactionClick(activeMsgId, emoji)}
                    sx={{ 
                        fontSize: '1.2rem', 
                        p: 0.5,
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', transform: 'scale(1.2)' },
                        transition: 'transform 0.1s'
                    }}
                >
                    {emoji}
                </IconButton>
            ))}
        </Popover>

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