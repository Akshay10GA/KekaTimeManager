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
  Chip,
  Collapse
} from "@mui/material";
import { supabase } from "../../supabaseClient";
import { CommentSection } from "@guozg/react-comments-section";
import "@guozg/react-comments-section/dist/index.css";

// "Hidden" storage key for daily limit
const STORAGE_KEY_HIDDEN = "keka_sys_pref_log_v2";
// Storage key for identifying user for reactions/replies
const STORAGE_KEY_USER_ID = "keka_confession_user_id";

// Available reactions
const EMOJIS = ['😅', '😂', '🥲', '😘', '😡', '😱', '🖕', '👍', '🍌', '🍆', '🍑'];

const ConfessionPopup = ({ open, onClose }) => {
  const [confession, setConfession] = useState("");
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState({}); 
  const [replyCounts, setReplyCounts] = useState({}); // { [confessionId]: count }
  const [commentsData, setCommentsData] = useState({}); 
  const [expandedComments, setExpandedComments] = useState({}); 
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

  // Get or Create Persistent User ID
  const userId = useMemo(() => {
    let id = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_USER_ID, id);
    }
    return id;
  }, []);

  // Generate identity: Use 'quizLastUser' if available, otherwise 'Anonymous'
  const currentUser = useMemo(() => {
    const storedName = localStorage.getItem("quizLastUser");
    const displayName = storedName ? storedName : "Anonymous";
    
    return {
      userId: userId,
      // Update avatar to match the display name
      avatarUrl: `https://ui-avatars.com/api/?name=${displayName}&background=random&seed=${userId}`,
      name: displayName,
      profileUrl: "#"
    };
  }, [userId]);

  useEffect(() => {
    if (open) {
      checkDailyLimit();
      fetchConfessions();
    } else {
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

    if (error) console.error("Error fetching:", error);
    else {
      setMessages(msgs || []);
      if (msgs?.length > 0) {
        const ids = msgs.map(m => m.id);
        fetchReactions(ids);
        fetchReplyCounts(ids);
      }
    }
    setLoading(false);
  };

  const fetchReactions = async (msgIds) => {
    const { data, error } = await supabase
      .from("confession_reactions")
      .select("confession_id, reaction, user_id")
      .in("confession_id", msgIds);

    if (error) return;

    const reactionMap = {};
    msgIds.forEach(id => reactionMap[id] = { counts: {}, userReaction: null });

    data.forEach(r => {
      if (!reactionMap[r.confession_id]) return;
      reactionMap[r.confession_id].counts[r.reaction] = (reactionMap[r.confession_id].counts[r.reaction] || 0) + 1;
      if (r.user_id === userId) reactionMap[r.confession_id].userReaction = r.reaction;
    });
    setReactions(reactionMap);
  };

  const fetchReplyCounts = async (ids) => {
    const { data, error } = await supabase
        .from("confession_replies")
        .select("confession_id")
        .is("parent_id", null)
        .in("confession_id", ids);

    if (error) {
        console.error("Error fetching reply counts:", error);
        return;
    }

    const counts = {};
    ids.forEach(id => counts[id] = 0);
    data.forEach(row => {
        counts[row.confession_id] = (counts[row.confession_id] || 0) + 1;
    });
    setReplyCounts(counts);
  };

  // --- COMMENT LOGIC ---

  const buildCommentTree = (flatComments) => {
    const map = {};
    const roots = [];

    flatComments.forEach(c => {
      map[c.id] = {
        userId: c.user_id,
        comId: c.id.toString(),
        fullName: c.full_name,
        avatarUrl: c.avatar_url,
        text: c.text,
        replies: [] 
      };
    });

    flatComments.forEach(c => {
      if (c.parent_id) {
        if (map[c.parent_id]) {
          map[c.parent_id].replies.push(map[c.id]);
        }
      } else {
        roots.push(map[c.id]);
      }
    });
    return roots;
  };

  const fetchComments = async (confessionId) => {
    const { data, error } = await supabase
      .from("confession_replies")
      .select("*")
      .eq("confession_id", confessionId)
      .order("created_at", { ascending: true });

    if (!error && data) {
      setCommentsData(prev => ({
        ...prev,
        [confessionId]: buildCommentTree(data)
      }));
    }
  };

  const toggleComments = (confessionId) => {
    setExpandedComments(prev => {
      const isOpen = !!prev[confessionId];
      if (!isOpen) fetchComments(confessionId); 
      return { ...prev, [confessionId]: !isOpen };
    });
  };

  const handleCommentSubmit = async (data, confessionId) => {
    let finalParentId = data.repliedToCommentId || null;
    let finalText = filterProfanity(data.text);

    // DEPTH CHECK LOGIC:
    if (finalParentId) {
        const { data: parentComment } = await supabase
            .from("confession_replies")
            .select("parent_id, full_name")
            .eq("id", finalParentId)
            .single();
        
        if (parentComment) {
            if (parentComment.parent_id) {
                finalParentId = parentComment.parent_id;
                finalText = `@${parentComment.full_name || 'User'} ${finalText}`;
            }
        }
    }

    const payload = {
      confession_id: confessionId,
      user_id: currentUser.userId,
      text: finalText,
      parent_id: finalParentId, 
      full_name: currentUser.name,
      avatar_url: currentUser.avatarUrl
    };

    const { error } = await supabase.from("confession_replies").insert([payload]);
    
    if (error) {
      console.error("Reply error", error);
    } else {
      fetchComments(confessionId);
      if (!payload.parent_id) {
        setReplyCounts(prev => ({
            ...prev,
            [confessionId]: (prev[confessionId] || 0) + 1
        }));
      }
    }
  };

  // Admin delete reply handler
  const handleDeleteComment = async (data, confessionId) => {
    const comId = data.comId; 
    if (!window.confirm("Delete this reply?")) return;

    const { error } = await supabase
      .from("confession_replies")
      .delete()
      .eq("id", comId);

    if (error) {
      console.error("Error deleting reply:", error);
    } else {
      fetchComments(confessionId);
      fetchReplyCounts([confessionId]);
    }
  };

  // Helper to spoof user IDs for admin so they see the delete button
  const prepareCommentsForRender = (comments, isAdmin, adminId) => {
    if (!isAdmin) return comments;
    const traverse = (nodes) => {
        return nodes.map(node => ({
            ...node,
            userId: adminId, 
            replies: node.replies ? traverse(node.replies) : []
        }));
    };
    return traverse(comments);
  };

  // --- REACTION LOGIC ---

  const handleReactionClick = async (msgId, emoji) => {
    setAnchorEl(null);
    setActiveMsgId(null);
    const currentData = reactions[msgId] || { counts: {}, userReaction: null };
    const oldReaction = currentData.userReaction;
    const isRemoving = oldReaction === emoji;
    const newReaction = isRemoving ? null : emoji;

    setReactions(prev => {
      const newState = { ...prev };
      const msgState = { ...newState[msgId], counts: { ...newState[msgId].counts } };
      if (oldReaction) {
        msgState.counts[oldReaction] = Math.max(0, (msgState.counts[oldReaction] || 0) - 1);
        if (msgState.counts[oldReaction] === 0) delete msgState.counts[oldReaction];
      }
      if (newReaction) msgState.counts[newReaction] = (msgState.counts[newReaction] || 0) + 1;
      msgState.userReaction = newReaction;
      newState[msgId] = msgState;
      return newState;
    });

    try {
      if (isRemoving) {
        await supabase.from("confession_reactions").delete().match({ confession_id: msgId, user_id: userId });
      } else {
        await supabase.from("confession_reactions").upsert({ confession_id: msgId, user_id: userId, reaction: emoji });
      }
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async () => {
    if (!confession.trim()) return;
    if (limitReached && !isAdmin) return;

    setSending(true);
    setErrorMsg("");
    const cleanConfession = filterProfanity(confession);

    const { error } = await supabase.from("confessions").insert([{ content: cleanConfession }]);
    if (error) setErrorMsg("Failed to send.");
    else {
      setConfession("");
      if (!isAdmin) setDailyLimit();
      fetchConfessions();
    }
    setSending(false);
  };

  const handleAdminLogin = () => {
    if (passkeyInput === import.meta.env.VITE_ADMIN_PASSKEY) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setPasskeyInput("");
    } else alert("Incorrect Passkey");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete?")) return;
    const { error } = await supabase.from("confessions").delete().eq("id", id);
    if (!error) setMessages(prev => prev.filter(m => m.id !== id));
  };

  return (
    <>
      <style>{`
        /* Overrides for the CommentSection library to fit dark theme */
        .sc-user-input {
            background-color: transparent !important;
        }
        /* Style the input box: opaque dark background for visibility */
        .sc-input-box {
            background-color: #2a2a2a !important; 
            border: 1px solid #555 !important;
            color: white !important;
        }
        /* Style the comment display text */
        .sc-comment-text {
            color: #e0e0e0 !important;
        }
        /* Style user names */
        .sc-user-name {
            color: #f78900 !important;
        }
        /* HIDE THE DEFAULT EMOJI PICKER from the library */
        .sc-emoji-icon, .emoji-icon {
            display: none !important;
        }
      `}</style>
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
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    </svg>
                </IconButton>
            </Box>
            <IconButton onClick={onClose} sx={{ color: 'white' }}>✕</IconButton>
        </DialogTitle>
        
        <DialogContent>
            <Box sx={{ mb: 3 }}>
            {limitReached && !isAdmin ? (
                <Typography variant="body2" sx={{ color: '#ffab40', textAlign: 'center', p: 2, border: '1px dashed #ffab40', borderRadius: 1 }}>
                Limit reached for today.
                </Typography>
            ) : (
                <>
                <TextField
                    fullWidth multiline rows={3}
                    placeholder={isAdmin ? "Admin Post" : "Type confession..."}
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
                    variant="contained" fullWidth 
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
            
            {loading ? (
              <Box display="flex" justifyContent="center" p={2}><CircularProgress size={24} sx={{ color: '#f78900' }} /></Box>
            ) : (
              <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
                {messages.length === 0 ? <Typography align="center" color="#777">No confessions.</Typography> : 
                messages.map((msg) => {
                    const msgReactions = reactions[msg.id] || { counts: {}, userReaction: null };
                    const isCommentsOpen = !!expandedComments[msg.id];
                    const replyCount = replyCounts[msg.id] || 0;
                    
                    const rawComments = commentsData[msg.id] || [];
                    const renderedComments = prepareCommentsForRender(rawComments, isAdmin, currentUser.userId);

                    return (
                    <ListItem key={msg.id} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2, borderRadius: 1, flexDirection: 'column', alignItems: 'flex-start', position: 'relative', pr: isAdmin ? 5 : 2 }}>
                        <ListItemText 
                            primary={msg.content} 
                            secondary={new Date(msg.created_at).toLocaleString()}
                            primaryTypographyProps={{ style: { color: '#e0e0e0', wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
                            secondaryTypographyProps={{ style: { color: '#666', fontSize: '0.75rem' } }}
                            sx={{ width: '100%', mb: 1 }}
                        />
                        
                        <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                            {/* Reactions */}
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {Object.entries(msgReactions.counts).map(([emoji, count]) => (
                                    <Chip 
                                        key={emoji} label={`${emoji} ${count}`} size="small"
                                        onClick={() => handleReactionClick(msg.id, emoji)}
                                        sx={{
                                            height: '24px', fontSize: '0.8rem',
                                            bgcolor: msgReactions.userReaction === emoji ? 'rgba(247, 137, 0, 0.2)' : 'rgba(255,255,255,0.05)',
                                            color: msgReactions.userReaction === emoji ? '#f78900' : '#ccc',
                                            border: msgReactions.userReaction === emoji ? '1px solid #f78900' : '1px solid transparent',
                                        }}
                                    />
                                ))}
                                <IconButton size="small" onClick={(e) => { setAnchorEl(e.currentTarget); setActiveMsgId(msg.id); }}>
                                    <span style={{ fontSize: '1.2rem' }}>☺</span>
                                </IconButton>
                            </Box>
                            
                            {/* Reply Toggle */}
                            <Button 
                                size="small" 
                                sx={{ color: isCommentsOpen ? '#f78900' : '#aaa', textTransform: 'none' }}
                                onClick={() => toggleComments(msg.id)}
                            >
                                {isCommentsOpen 
                                    ? "Hide Replies" 
                                    : (replyCount > 0 ? `Replies (${replyCount})` : "Reply")
                                }
                            </Button>
                        </Box>

                        {/* Collapsible Comments Section */}
                        <Collapse in={isCommentsOpen} timeout="auto" unmountOnExit sx={{ width: '100%', mt: 2 }}>
                            <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 1, borderRadius: 1 }}>
                                <CommentSection
                                    currentUser={currentUser}
                                    logIn={{ loginLink: '#', signupLink: '#' }}
                                    commentData={renderedComments}
                                    onSubmitAction={(data) => handleCommentSubmit(data, msg.id)}
                                    onReplyAction={(data) => handleCommentSubmit(data, msg.id)}
                                    onDeleteAction={(data) => handleDeleteComment(data, msg.id)}
                                    currentData={(data) => {}} 
                                    placeholder="Write a reply..."
                                    submitBtnStyle={{ backgroundColor: '#f78900', border: 'none', color: 'white', padding: '8px 16px' }}
                                    cancelBtnStyle={{ backgroundColor: '#555', border: 'none', color: 'white', padding: '8px 16px' }}
                                    overlayStyle={{ backgroundColor: 'transparent', color: 'white' }}
                                    replyInputStyle={{ backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #555' }}
                                    inputStyle={{ backgroundColor: '#2a2a2a', color: 'white', border: '1px solid #555' }}
                                    hrStyle={{ border: '0.5px solid #444' }}
                                    titleStyle={{ color: '#ddd', fontSize: '0.9rem' }}
                                    customNoComment={() => <Typography variant="caption" color="#666" sx={{p:1, display:'block'}}>No replies yet. Be the first!</Typography>}
                                />
                            </Box>
                        </Collapse>

                        {isAdmin && (
                            <IconButton onClick={() => handleDelete(msg.id)} sx={{ color: '#ff4444', position: 'absolute', right: 4, top: 4 }}>
                                🗑
                            </IconButton>
                        )}
                    </ListItem>
                    )
                })}
              </List>
            )}
        </DialogContent>
      </Dialog>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => { setAnchorEl(null); setActiveMsgId(null); }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{ sx: { bgcolor: '#2a2a2a', border: '1px solid #444', p: 1, display: 'flex', gap: 1 } }}
      >
        {EMOJIS.map(emoji => (
            <IconButton key={emoji} onClick={() => handleReactionClick(activeMsgId, emoji)} sx={{ fontSize: '1.2rem', '&:hover': { transform: 'scale(1.2)' } }}>
                {emoji}
            </IconButton>
        ))}
      </Popover>

      <Dialog open={showAdminLogin} onClose={() => setShowAdminLogin(false)}>
        <DialogTitle>Admin Access</DialogTitle>
        <DialogContent>
            <TextField autoFocus margin="dense" label="Passkey" type="password" fullWidth variant="standard"
                value={passkeyInput} onChange={(e) => setPasskeyInput(e.target.value)}
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