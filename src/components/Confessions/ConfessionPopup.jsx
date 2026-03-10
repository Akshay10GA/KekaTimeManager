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
  Collapse,
  Avatar
} from "@mui/material";
import { supabase } from "../../supabaseClient";

// "Hidden" storage key for daily limit
const STORAGE_KEY_HIDDEN = "keka_sys_pref_log_v2";
// Storage key for identifying user for reactions/replies
const STORAGE_KEY_USER_ID = "keka_confession_user_id";

// Available reactions
const EMOJIS = ['😅', '😂', '🥲', '😘', '😡', '😱', '🖕', '👍', '🍌', '🍆', '🍑'];

// Add these new states near the top
const [imageFile, setImageFile] = useState(null);
const [imagePreview, setImagePreview] = useState(null);

// Add this handler for image selection
const handleImageChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

// Update handleCommentSubmit to accept gifUrl
const handleCommentSubmit = async (text, gifUrl, confessionId, parentId = null) => {
  let finalText = text ? filterProfanity(text) : "";

  const payload = {
    confession_id: confessionId,
    user_id: currentUser.userId,
    text: finalText,
    gif_url: gifUrl || null, // new field
    parent_id: parentId, 
    full_name: currentUser.name,
    avatar_url: currentUser.avatarUrl
  };

  const { error } = await supabase.from("confession_replies").insert([payload]);
  
  if (!error) {
    fetchComments(confessionId);
    if (!parentId) {
      setReplyCounts(prev => ({
          ...prev, [confessionId]: (prev[confessionId] || 0) + 1
      }));
    }
  }
};

// Update handleSubmit to process the image upload
const handleSubmit = async () => {
  if (!confession.trim() && !imageFile) return; // allow empty text if there is an image
  if (limitReached && !isAdmin) return;

  setSending(true);
  setErrorMsg("");
  const cleanConfession = filterProfanity(confession);
  let finalImageUrl = null;

  // Upload image if one is selected
  if (imageFile) {
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data, error: uploadError } = await supabase.storage
      .from('confession_media')
      .upload(`memes/${fileName}`, imageFile);

    if (uploadError) {
      setErrorMsg("Failed to upload image.");
      setSending(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('confession_media')
      .getPublicUrl(`memes/${fileName}`);
      
    finalImageUrl = publicUrl;
  }

  const payload = { 
    content: cleanConfession,
    image_url: finalImageUrl // new field
  };

  const { error } = await supabase.from("confessions").insert([payload]);
  
  if (error) {
    setErrorMsg("Failed to send.");
  } else {
    setConfession("");
    setImageFile(null);
    setImagePreview(null);
    if (!isAdmin) setDailyLimit();
    fetchConfessions();
  }
  setSending(false);
};

// --- CUSTOM COMMENT COMPONENTS ---

const CommentInput = ({ onSubmit, onCancel, placeholder = "Write a reply...", autoFocus = false }) => {
  const [text, setText] = useState("");
  const [showGifInput, setShowGifInput] = useState(false);
  const [gifUrl, setGifUrl] = useState("");

  const handleSubmit = () => {
    if (!text.trim() && !gifUrl.trim()) return;
    onSubmit(text, gifUrl); // Pass both text and gifUrl
    setText("");
    setGifUrl("");
    setShowGifInput(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
      <TextField
        fullWidth
        multiline
        autoFocus={autoFocus}
        size="small"
        placeholder={placeholder}
        value={text}
        onChange={(e) => setText(e.target.value)}
        sx={{
          backgroundColor: '#2a2a2a',
          '& .MuiOutlinedInput-root': {
            color: 'white',
            '& fieldset': { borderColor: '#555' },
            '&:hover fieldset': { borderColor: '#777' },
            '&.Mui-focused fieldset': { borderColor: '#f78900' },
          }
        }}
      />
      {showGifInput && (
        <TextField
          fullWidth
          size="small"
          placeholder="Paste GIF URL here..."
          value={gifUrl}
          onChange={(e) => setGifUrl(e.target.value)}
          sx={{
            backgroundColor: '#2a2a2a',
            '& .MuiOutlinedInput-root': {
              color: '#f78900',
              '& fieldset': { borderColor: '#555' },
            }
          }}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button 
          size="small" 
          onClick={() => setShowGifInput(!showGifInput)}
          sx={{ color: showGifInput ? '#aaa' : '#f78900', textTransform: 'none' }}
        >
          {showGifInput ? "Remove GIF" : "Add GIF (URL)"}
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {onCancel && (
            <Button size="small" onClick={onCancel} sx={{ color: '#aaa', textTransform: 'none' }}>
              Cancel
            </Button>
          )}
          <Button 
            variant="contained" 
            size="small" 
            onClick={handleSubmit}
            disabled={!text.trim() && !gifUrl.trim()}
            sx={{ bgcolor: '#f78900', '&:hover': { bgcolor: '#d67600' }, textTransform: 'none' }}
          >
            Post
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const CommentItem = ({ comment, onReply, onDelete, isAdmin, currentUserId }) => {
  const [isReplying, setIsReplying] = useState(false);

  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Avatar 
          src={comment.avatarUrl} 
          alt={comment.fullName}
          sx={{ width: 28, height: 28, bgcolor: '#f78900' }}
        />
        <Box sx={{ flex: 1 }}>
          {comment.text && (
            <Typography variant="body2" sx={{ color: '#e0e0e0', whiteSpace: 'pre-wrap', wordBreak: 'break-word', mt: 0.5 }}>
              {comment.text}
            </Typography>
          )}

          {/* Render GIF if exists */}
          {comment.gif_url && (
            <Box sx={{ mt: 1 }}>
              <img src={comment.gif_url} alt="GIF reply" style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: '8px' }} />
            </Box>
          )}

          {/* Actions Bar */}
          <Box sx={{ display: 'flex', gap: 2, mt: 0.5, alignItems: 'center' }}>
            <Button 
              size="small" onClick={() => setIsReplying(!isReplying)}
              sx={{ minWidth: 0, p: 0, color: '#888', fontSize: '0.75rem', textTransform: 'none', '&:hover': { color: '#f78900', bgcolor: 'transparent' } }}
            >
              Reply
            </Button>
            
            {(isAdmin || currentUserId === comment.userId) && (
              <Button 
                size="small" onClick={() => onDelete(comment.id)}
                sx={{ minWidth: 0, p: 0, color: '#888', fontSize: '0.75rem', textTransform: 'none', '&:hover': { color: '#ff4444', bgcolor: 'transparent' } }}
              >
                Delete
              </Button>
            )}
          </Box>

          {/* Reply Input */}
          {isReplying && (
            <Box sx={{ mt: 1, mb: 2 }}>
              <CommentInput 
                autoFocus
                placeholder={`Replying to ${comment.fullName}...`}
                onSubmit={(text, gifUrl) => {
                  onReply(text, gifUrl, comment.id); // pass gifUrl
                  setIsReplying(false);
                }}
                onCancel={() => setIsReplying(false)}
              />
            </Box>
          )}
        </Box>
      </Box>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <Box sx={{ ml: 2, mt: 1, pl: 2, borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
          {comment.replies.map(reply => (
            <CommentItem 
              key={reply.id} comment={reply} onReply={onReply} onDelete={onDelete} isAdmin={isAdmin} currentUserId={currentUserId}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

// --- MAIN COMPONENT ---

const ConfessionPopup = ({ open, onClose }) => {
  const [confession, setConfession] = useState("");
  const [messages, setMessages] = useState([]);
  const [reactions, setReactions] = useState({}); 
  const [replyCounts, setReplyCounts] = useState({}); 
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

  // Generate identity
  const currentUser = useMemo(() => {
    const storedName = localStorage.getItem("quizLastUser");
    const displayName = storedName ? storedName : "Anonymous";
    return {
      userId: userId,
      avatarUrl: `https://ui-avatars.com/api/?name=${displayName}&background=random&seed=${userId}`,
      name: displayName,
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

    // Initialize map
    flatComments.forEach(c => {
      map[c.id] = {
        id: c.id,
        userId: c.user_id,
        fullName: c.full_name,
        avatarUrl: c.avatar_url,
        text: c.text,
        created_at: c.created_at,
        replies: [] 
      };
    });

    // Link parents and children
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

  const handleCommentSubmit = async (text, confessionId, parentId = null) => {
    let finalText = filterProfanity(text);
    let finalParentId = parentId;

    // Check for depth limiting or mentions if necessary
    // (Custom logic: if replying to a nested comment, flat architecture with mentions is often easier, 
    // but here we support infinite nesting via recursive components, so we pass parentId directly)
    
    // NOTE: To prevent infinite indentation on small screens, you could cap the depth here 
    // and force a flat structure after N levels, but we'll stick to tree for now.

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
      if (!finalParentId) {
        setReplyCounts(prev => ({
            ...prev,
            [confessionId]: (prev[confessionId] || 0) + 1
        }));
      }
    }
  };

  const handleDeleteComment = async (commentId, confessionId) => {
    if (!window.confirm("Delete this reply?")) return;

    const { error } = await supabase
      .from("confession_replies")
      .delete()
      .eq("id", commentId);

    if (error) {
      console.error("Error deleting reply:", error);
    } else {
      fetchComments(confessionId);
      // Re-fetch counts loosely or decrement manually
      fetchReplyCounts([confessionId]);
    }
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
        
        {/* NEW: Image Upload & Preview UI */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button 
                    component="label" 
                    sx={{ color: '#f78900', textTransform: 'none', border: '1px solid #555' }}
                >
                    📷 Add Meme
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </Button>
                {imagePreview && (
                    <Box sx={{ position: 'relative' }}>
                        <img src={imagePreview} alt="preview" style={{ height: '40px', borderRadius: '4px' }} />
                        <IconButton 
                            size="small" 
                            sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'rgba(0,0,0,0.7)', color: 'white', width: 20, height: 20 }} 
                            onClick={() => { setImageFile(null); setImagePreview(null); }}
                        >✕</IconButton>
                    </Box>
                )}
            </Box>

            <Button 
                variant="contained" 
                sx={{ bgcolor: '#f78900', '&:hover': { bgcolor: '#d67600' } }}
                onClick={handleSubmit}
                disabled={sending || (!confession.trim() && !imageFile)}
            >
                {sending ? "Posting..." : "Confess"}
            </Button>
        </Box>
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
            const nestedComments = commentsData[msg.id] || [];

            return (
            <ListItem key={msg.id} sx={{ bgcolor: 'rgba(255,255,255,0.05)', mb: 2, borderRadius: 1, flexDirection: 'column', alignItems: 'flex-start', position: 'relative', pr: isAdmin ? 5 : 2 }}>
                
                {/* Render Confession Text */}
                {msg.content && (
                  <ListItemText 
                      primary={msg.content} 
                      secondary={new Date(msg.created_at).toLocaleString()}
                      primaryTypographyProps={{ style: { color: '#e0e0e0', wordBreak: 'break-word', whiteSpace: 'pre-wrap' } }}
                      secondaryTypographyProps={{ style: { color: '#666', fontSize: '0.75rem' } }}
                      sx={{ width: '100%', mb: 0.5 }}
                  />
                )}

                {/* NEW: Render Confession Meme Image */}
                {msg.image_url && (
                  <Box sx={{ width: '100%', mt: 1, mb: 1 }}>
                    <img src={msg.image_url} alt="Meme" style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }} />
                  </Box>
                )}
                
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    {/* Reactions */}
                    {/* ... (Keep existing reactions code exactly the same) ... */}
                </Box>

                {/* Collapsible Comments Section */}
                <Collapse in={isCommentsOpen} timeout="auto" unmountOnExit sx={{ width: '100%', mt: 2 }}>
                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.2)', p: 2, borderRadius: 1 }}>
                        <CommentInput 
                            onSubmit={(text, gifUrl) => handleCommentSubmit(text, gifUrl, msg.id, null)} 
                        />
                        {/* ... (Keep existing comment rendering logic) ... */}
                        {nestedComments.map(comment => (
                            <CommentItem 
                                key={comment.id} 
                                comment={comment} 
                                onReply={(text, gifUrl, parentId) => handleCommentSubmit(text, gifUrl, msg.id, parentId)}
                                onDelete={(commentId) => handleDeleteComment(commentId, msg.id)}
                                isAdmin={isAdmin}
                                currentUserId={currentUser.userId}
                            />
                        ))}
                    </Box>
                </Collapse>

                {/* ... */}
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
