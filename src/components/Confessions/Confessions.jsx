import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import "./Confessions.css";

const STORAGE_KEY_HIDDEN = "keka_sys_pref_log_v2";
const STORAGE_KEY_USER_ID = "keka_confession_user_id";
const EMOJIS = ['❤️', '🔥', '😂', '💀', '😅', '🥲', '😘', '😡', '😱', '🤡', '👍', '👎', '🍌', '🍆', '🍑'];

// ==========================================
// OUTSOURCED SUBCOMPONENTS (Prevents Remount Bugs)
// ==========================================
const ReactionPicker = ({ targetId, type, activeReactionTarget, handleReactionClick }) => {
  if (activeReactionTarget.id !== targetId || activeReactionTarget.type !== type) return null;
  return (
    <div className="reaction-picker-panel">
      {EMOJIS.map(emoji => (
        <button key={emoji} className="emoji-btn" onClick={(e) => { e.stopPropagation(); handleReactionClick(emoji); }}>
          {emoji}
        </button>
      ))}
    </div>
  );
};

const ReplyInputForm = ({ confessionId, parentId = null, onCancel = null, handleCommentSubmit }) => {
  const [text, setText] = useState("");
  const [gif, setGif] = useState("");
  const [showGif, setShowGif] = useState(false);

  return (
    <div className="reply-form-container mt-2 mb-3">
      <div className="inline-reply-box">
        <span className="prompt-symbol purple-text">{">"}</span>
        <input type="text" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a reply..." className="terminal-input" />
        <button className="action-text-btn" onClick={() => setShowGif(!showGif)}>+GIF</button>
      </div>
      {showGif && (
        <div className="inline-reply-box mt-2">
          <span className="prompt-symbol purple-text">URL</span>
          <input type="text" value={gif} onChange={e=>setGif(e.target.value)} placeholder="Paste GIF link here..." className="terminal-input" />
        </div>
      )}
      <div className="mt-2 text-right">
        {onCancel && <button className="action-text-btn mr-3" onClick={onCancel}>CANCEL</button>}
        <button className="execute-btn purple-btn" onClick={() => { handleCommentSubmit(text, gif, confessionId, parentId); setText(""); setGif(""); setShowGif(false); if(onCancel) onCancel(); }} disabled={!text && !gif}>
          SEND REPLY
        </button>
      </div>
    </div>
  );
};

const CommentThread = ({ 
  comment, confessionId, replyReactions, handleReactionClick, 
  activeReactionTarget, setActiveReactionTarget, isAdmin, 
  currentUser, handleDelete, handleCommentSubmit 
}) => {
  const [replying, setReplying] = useState(false);
  const myReactions = replyReactions[comment.id] || { counts: {}, userReaction: null };

  return (
    <div className="comment-item">
      <div className="comment-header">
        <img src={comment.avatar_url} alt="avatar" className="comment-avatar" />
        <span className="comment-author">{comment.full_name}</span>
        <span className="comment-time">{new Date(comment.created_at).toLocaleTimeString()}</span>
      </div>
      <div className="comment-body">{comment.text}</div>
      {comment.gif_url && <img src={comment.gif_url} alt="GIF" className="comment-media" />}
      
      <div className="reaction-bar">
        <div className="reaction-group">
          {Object.entries(myReactions.counts).map(([emoji, count]) => (
            <button key={emoji} className={`reaction-chip ${myReactions.userReaction === emoji ? 'active' : ''}`}
              onClick={(e) => { e.stopPropagation(); handleReactionClick(emoji, true, { id: comment.id, type: 'reply' }); }}>
              {emoji} {count}
            </button>
          ))}
          <div className="relative-container">
            <button className="add-reaction-btn" onClick={() => setActiveReactionTarget({ id: comment.id, type: 'reply' })}>+</button>
            <ReactionPicker targetId={comment.id} type="reply" activeReactionTarget={activeReactionTarget} handleReactionClick={handleReactionClick} />
          </div>
        </div>
        
        <div>
          <button className="action-text-btn mr-3" onClick={() => setReplying(!replying)}>REPLY</button>
          {(isAdmin || currentUser.userId === comment.user_id) && (
            <button className="action-text-btn alert-text" onClick={() => handleDelete(comment.id, 'reply')}>DEL</button>
          )}
        </div>
      </div>

      {replying && <ReplyInputForm confessionId={confessionId} parentId={comment.id} onCancel={() => setReplying(false)} handleCommentSubmit={handleCommentSubmit} />}

      {comment.replies?.length > 0 && (
        <div className="nested-comments">
          {comment.replies.map(reply => (
            <CommentThread key={reply.id} comment={reply} confessionId={confessionId} replyReactions={replyReactions} handleReactionClick={handleReactionClick} activeReactionTarget={activeReactionTarget} setActiveReactionTarget={setActiveReactionTarget} isAdmin={isAdmin} currentUser={currentUser} handleDelete={handleDelete} handleCommentSubmit={handleCommentSubmit} />
          ))}
        </div>
      )}
    </div>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
const Confessions = () => {
  const [confession, setConfession] = useState("");
  const [messages, setMessages] = useState([]);
  
  const [reactions, setReactions] = useState({}); 
  const [replyReactions, setReplyReactions] = useState({});
  const [replyCounts, setReplyCounts] = useState({}); 
  const [commentsData, setCommentsData] = useState({}); 
  const [expandedComments, setExpandedComments] = useState({}); 
  
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [activeReactionTarget, setActiveReactionTarget] = useState({ id: null, type: null }); 
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const userId = useMemo(() => {
    let id = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY_USER_ID, id);
    }
    return id;
  }, []);

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
    checkDailyLimit();
    fetchConfessions();
  }, []);

  const checkDailyLimit = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY_HIDDEN);
      if (storedData) {
        const jsonStr = atob(storedData); 
        const { last_entry_date } = JSON.parse(jsonStr);
        setLimitReached(last_entry_date === new Date().toDateString());
      }
    } catch (e) { console.error("System pref error", e); }
  };

  const setDailyLimit = () => {
    const data = JSON.stringify({ last_entry_date: new Date().toDateString(), sys_id: Math.random().toString(36).substring(7) });
    localStorage.setItem(STORAGE_KEY_HIDDEN, btoa(data));
    setLimitReached(true);
  };

  const filterProfanity = (text) => {
    const badWords = ["porn", "sex", "boobs", "boob", "dick", "pussy", "mastrubation", "masturbation", "gdtc", "go digital", "godigital", "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "whore", "slut", "rape", "damn", "cock", "suck", "nigger", "fag", "dyke", "retard", "piss"];
    let cleanedText = text;
    badWords.sort((a, b) => b.length - a.length).forEach((word) => {
      cleanedText = cleanedText.replace(new RegExp(`\\b${word}\\b`, "gi"), "***");
    });
    return cleanedText;
  };

  const fetchConfessions = async () => {
    setLoading(true);
    const { data: msgs, error } = await supabase.from("confessions").select("*").order("created_at", { ascending: false }).limit(50);
    if (!error) {
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
    const { data, error } = await supabase.from("confession_reactions").select("confession_id, reaction, user_id").in("confession_id", msgIds);
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

  const fetchReplyReactions = async (replyIds) => {
    if(!replyIds || replyIds.length === 0) return;
    const { data, error } = await supabase.from("confession_reply_reactions").select("reply_id, reaction, user_id").in("reply_id", replyIds);
    if (error) return;
    const reactionMap = {};
    replyIds.forEach(id => reactionMap[id] = { counts: {}, userReaction: null });
    data.forEach(r => {
      if (!reactionMap[r.reply_id]) return;
      reactionMap[r.reply_id].counts[r.reaction] = (reactionMap[r.reply_id].counts[r.reaction] || 0) + 1;
      if (r.user_id === userId) reactionMap[r.reply_id].userReaction = r.reaction;
    });
    setReplyReactions(prev => ({ ...prev, ...reactionMap }));
  };

  const fetchReplyCounts = async (ids) => {
    const { data, error } = await supabase.from("confession_replies").select("confession_id").is("parent_id", null).in("confession_id", ids);
    if (error) return;
    const counts = {};
    ids.forEach(id => counts[id] = 0);
    data.forEach(row => { counts[row.confession_id] = (counts[row.confession_id] || 0) + 1; });
    setReplyCounts(counts);
  };

  const fetchComments = async (confessionId) => {
    const { data, error } = await supabase.from("confession_replies").select("*").eq("confession_id", confessionId).order("created_at", { ascending: true });
    if (!error && data) {
      fetchReplyReactions(data.map(c => c.id));
      const map = {}, roots = [];
      data.forEach(c => map[c.id] = { ...c, replies: [] });
      data.forEach(c => c.parent_id && map[c.parent_id] ? map[c.parent_id].replies.push(map[c.id]) : roots.push(map[c.id]));
      setCommentsData(prev => ({ ...prev, [confessionId]: roots }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setErrorMsg(""); 
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!confession.trim() && !imageFile) return; 
    if (limitReached && !isAdmin) return;

    setSending(true);
    setErrorMsg("");
    let finalImageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('confession_media').upload(`memes/${fileName}`, imageFile);
      if (uploadError) {
        setErrorMsg(`Media Error: ${uploadError.message}`);
        setSending(false);
        return;
      }
      const { data: { publicUrl } } = supabase.storage.from('confession_media').getPublicUrl(`memes/${fileName}`);
      finalImageUrl = publicUrl;
    }

    const { error } = await supabase.from("confessions").insert([{ content: filterProfanity(confession), image_url: finalImageUrl }]);
    
    if (error) setErrorMsg(`DB Error: ${error.message}`);
    else {
      setConfession(""); setImageFile(null); setImagePreview(null);
      if (!isAdmin) setDailyLimit();
      await fetchConfessions();
    }
    setSending(false);
  };

  const handleAdminLogin = () => {
    if (passkeyInput === import.meta.env.VITE_ADMIN_PASSKEY) {
      setIsAdmin(true); setShowAdminLogin(false); setPasskeyInput("");
    } else alert("ACCESS DENIED");
  };

  const handleDelete = async (id, type = 'confession') => {
    if (!window.confirm("EXECUTE DELETE?")) return;
    if (type === 'confession') {
      const { error } = await supabase.from("confessions").delete().eq("id", id);
      if (!error) setMessages(prev => prev.filter(m => m.id !== id));
    } else {
      await supabase.from("confession_replies").delete().eq("id", id);
    }
  };

  const handleReactionClick = async (emoji, isDirectClick = false, overrideTarget = null) => {
    // 1. Capture the exact target synchronously
    const target = isDirectClick ? overrideTarget : { ...activeReactionTarget };
    
    if (!target || !target.id) return;
    
    // 2. Clear the picker UI immediately
    if (!isDirectClick) setActiveReactionTarget({ id: null, type: null });

    const isConfession = target.type === 'confession';
    const tableName = isConfession ? "confession_reactions" : "confession_reply_reactions";
    const idField = isConfession ? "confession_id" : "reply_id";
    const setStateFn = isConfession ? setReactions : setReplyReactions;

    let dbAction = null; 

    // 3. Functional state update (100% immune to stale closures)
    setStateFn(prev => {
      const safePrev = prev || {};
      const prevMsgData = safePrev[target.id] || { counts: {}, userReaction: null };
      
      const isRemoving = prevMsgData.userReaction === emoji;
      const newReaction = isRemoving ? null : emoji;

      // Ensure DB action uses the mathematically correct UI state
      dbAction = { isRemoving, id: target.id };

      const newCounts = { ...(prevMsgData.counts || {}) };

      if (prevMsgData.userReaction) {
        newCounts[prevMsgData.userReaction] = Math.max(0, (newCounts[prevMsgData.userReaction] || 0) - 1);
        if (newCounts[prevMsgData.userReaction] === 0) {
          delete newCounts[prevMsgData.userReaction];
        }
      }

      if (newReaction) {
        newCounts[newReaction] = (newCounts[newReaction] || 0) + 1;
      }

      return {
        ...safePrev,
        [target.id]: {
          counts: newCounts,
          userReaction: newReaction
        }
      };
    });

    // 4. Sync with DB outside the state cycle via timeout microtask
    setTimeout(async () => {
      if (!dbAction) return;
      try {
        if (dbAction.isRemoving) {
          await supabase.from(tableName).delete().match({ [idField]: dbAction.id, user_id: userId });
        } else {
          await supabase.from(tableName).upsert({ [idField]: dbAction.id, user_id: userId, reaction: emoji });
        }
      } catch (err) {
        console.error("Reaction Sync Error:", err);
      }
    }, 0);
  };

  const handleCommentSubmit = async (text, gifUrl, confessionId, parentId = null) => {
    if(!text && !gifUrl) return;
    const payload = {
      confession_id: confessionId, user_id: currentUser.userId, text: filterProfanity(text),
      gif_url: gifUrl || null, parent_id: parentId, full_name: currentUser.name, avatar_url: currentUser.avatarUrl
    };
    await supabase.from("confession_replies").insert([payload]);
    fetchComments(confessionId);
    if (!parentId) setReplyCounts(prev => ({ ...prev, [confessionId]: (prev[confessionId] || 0) + 1 }));
  };

  return (
    <>
      {activeReactionTarget.id && (
        <div className="reaction-backdrop" onClick={() => setActiveReactionTarget({ id: null, type: null })}></div>
      )}

      <div className="confessions-wrapper terminal-wrapper full-width-override">
        <div className="confessions-grid">
          
          <div className="widget confessions-input-widget">
            <div className="widget-header purple-header flex-between">
              <span>SECURE CHANNEL // NEW CONFESSION</span>
              <button className="action-text-btn" onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(!showAdminLogin)}>
                {isAdmin ? "SYS.ADMIN(ACTIVE)" : "SYS.LOGIN"}
              </button>
            </div>

            {showAdminLogin && !isAdmin && (
              <div className="admin-login-box mb-4">
                <span className="prompt-symbol alert-text">root@keka:~$</span>
                <input type="password" value={passkeyInput} onChange={e => setPasskeyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} placeholder="Enter Passkey" className="terminal-input" />
                <button className="execute-btn alert-btn" onClick={handleAdminLogin}>AUTH</button>
              </div>
            )}
            
            <div className="confession-guidelines">
              <p><strong>[SYS.MSG]</strong> Encrypted and anonymous.</p>
              <ul><li>No real names.</li><li>Keep it mostly respectful.</li></ul>
            </div>

            {limitReached && !isAdmin ? (
              <div className="terminal-log alert-text text-center border-dashed p-3">
                [RATE LIMIT EXCEEDED. RESUMES AT 00:00 HOURS]
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="confession-form">
                <div className="terminal-prompt-container textarea-container">
                  <span className="prompt-symbol purple-text">{">"}</span>
                  <textarea className="terminal-input confession-textarea" placeholder={isAdmin ? "Broadcast system wide message..." : "Spill the tea..."} value={confession} onChange={(e) => setConfession(e.target.value)} />
                </div>

                {imagePreview && (
                  <div className="image-preview-box">
                    <img src={imagePreview} alt="preview" />
                    <button type="button" onClick={() => {setImageFile(null); setImagePreview(null)}}>✕</button>
                  </div>
                )}

                <div className="form-footer mt-3">
                  <label className="execute-btn secondary-btn cursor-pointer">
                    [+] ATTACH MEME
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </label>
                  <button type="submit" className="execute-btn purple-btn" disabled={sending || (!confession.trim() && !imageFile)}>
                    {sending ? "ENCRYPTING..." : "POST CONFESSION"}
                  </button>
                </div>
                {errorMsg && <div className="terminal-log alert-text mt-2">{errorMsg}</div>}
              </form>
            )}
          </div>

          <div className="widget confessions-feed-widget">
            <div className="widget-header purple-header">LIVE FEED // DECRYPTED MESSAGES</div>
            
            <div className="feed-container custom-scrollbar">
              {loading ? <div className="terminal-log text-center mt-4">FETCHING PACKETS...</div> : 
               messages.length === 0 ? <div className="terminal-log alert-text text-center mt-4">[NO MESSAGES FOUND]</div> : 
               messages.map((msg) => {
                const msgReactions = reactions[msg.id] || { counts: {}, userReaction: null };
                const isCommentsOpen = !!expandedComments[msg.id];
                const replyCount = replyCounts[msg.id] || 0;
                const nestedComments = commentsData[msg.id] || [];

                return (
                  <div key={msg.id} className="confession-card">
                    <div className="confession-meta">
                      <span className="confession-id">ID: {String(msg.id).split('-')[0]}</span>
                      <span>{new Date(msg.created_at).toLocaleString()}</span>
                      {isAdmin && <button className="action-text-btn alert-text ml-auto" onClick={() => handleDelete(msg.id)}>DEL</button>}
                    </div>
                    
                    {msg.content && <div className="confession-text">{msg.content}</div>}
                    {msg.image_url && <img src={msg.image_url} alt="Meme" className="confession-media" />}
                    
                    <div className="reaction-bar mt-3">
                      <div className="reaction-group">
                        {Object.entries(msgReactions.counts).map(([emoji, count]) => (
                          <button key={emoji} className={`reaction-chip ${msgReactions.userReaction === emoji ? 'active' : ''}`}
                            onClick={(e) => { e.stopPropagation(); handleReactionClick(emoji, true, { id: msg.id, type: 'confession' }); }}>
                            {emoji} {count}
                          </button>
                        ))}
                        <div className="relative-container">
                          <button className="add-reaction-btn" onClick={() => setActiveReactionTarget({ id: msg.id, type: 'confession' })}>+</button>
                          <ReactionPicker targetId={msg.id} type="confession" activeReactionTarget={activeReactionTarget} handleReactionClick={handleReactionClick} />
                        </div>
                      </div>
                      
                      <button className="action-text-btn purple-text" onClick={() => { setExpandedComments(p => ({...p, [msg.id]: !p[msg.id]})); if(!expandedComments[msg.id]) fetchComments(msg.id); }}>
                        {isCommentsOpen ? "[-] HIDE REPLIES" : `[+] REPLIES (${replyCount})`}
                      </button>
                    </div>

                    {isCommentsOpen && (
                      <div className="comments-section mt-3">
                        <ReplyInputForm confessionId={msg.id} handleCommentSubmit={handleCommentSubmit} />
                        <div className="comments-list">
                          {nestedComments.length === 0 ? <div className="terminal-log text-center">[NO REPLIES YET]</div> :
                            nestedComments.map(comment => (
                              <CommentThread key={comment.id} comment={comment} confessionId={msg.id} replyReactions={replyReactions} handleReactionClick={handleReactionClick} activeReactionTarget={activeReactionTarget} setActiveReactionTarget={setActiveReactionTarget} isAdmin={isAdmin} currentUser={currentUser} handleDelete={handleDelete} handleCommentSubmit={handleCommentSubmit} />
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Confessions;