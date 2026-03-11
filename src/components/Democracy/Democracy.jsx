import React, { useState, useEffect, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import "./Democracy.css";

const STORAGE_KEY_USER_ID = "keka_confession_user_id";

const Democracy = () => {
  const [activeTab, setActiveTab] = useState("polls"); // 'polls', 'plans', 'opinions'
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [polls, setPolls] = useState([]);
  const [plans, setPlans] = useState([]);
  const [opinions, setOpinions] = useState([]);

  // Form States
  const [newPollQ, setNewPollQ] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [newPlan, setNewPlan] = useState({ title: "", description: "", date: "" });
  const [newOpinion, setNewOpinion] = useState("");

  // Admin States
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Get Current User Info
  const currentUser = useMemo(() => {
    let id = localStorage.getItem(STORAGE_KEY_USER_ID);
    if (!id) {
      id = "user_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem(STORAGE_KEY_USER_ID, id);
    }
    const storedName = localStorage.getItem("quizLastUser") || "Anonymous";
    return { userId: id, name: storedName };
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    if (activeTab === "polls") {
      const { data } = await supabase.from("democracy_polls").select("*").order("created_at", { ascending: false });
      setPolls(data || []);
    } else if (activeTab === "plans") {
      const { data } = await supabase.from("democracy_plans").select("*").order("created_at", { ascending: false });
      setPlans(data || []);
    } else if (activeTab === "opinions") {
      const { data } = await supabase.from("democracy_opinions").select("*").order("created_at", { ascending: false });
      setOpinions(data || []);
    }
    setLoading(false);
  };

  // --- SUBMISSION HANDLERS ---
  const submitPoll = async (e) => {
    e.preventDefault();
    const validOptions = pollOptions.filter(o => o.trim() !== "").map(opt => ({ text: opt, votes: [] }));
    if (!newPollQ || validOptions.length < 2) return alert("Need a question and at least 2 options.");
    
    await supabase.from("democracy_polls").insert([{ question: newPollQ, options: validOptions }]);
    setNewPollQ(""); setPollOptions(["", ""]);
    fetchData();
  };

  const submitPlan = async (e) => {
    e.preventDefault();
    if (!newPlan.title || !newPlan.date) return alert("Title and Date required.");
    
    await supabase.from("democracy_plans").insert([{ 
      title: newPlan.title, description: newPlan.description, plan_date: newPlan.date, members: [{ id: currentUser.userId, name: currentUser.name }] 
    }]);
    setNewPlan({ title: "", description: "", date: "" });
    fetchData();
  };

  const submitOpinion = async (e) => {
    e.preventDefault();
    if (!newOpinion.trim()) return;
    await supabase.from("democracy_opinions").insert([{ content: newOpinion, upvotes: [], downvotes: [] }]);
    setNewOpinion("");
    fetchData();
  };

  // --- INTERACTION HANDLERS ---
  const handleVotePoll = async (pollId, optionIndex) => {
    const poll = polls.find(p => p.id === pollId);
    let updatedOptions = [...poll.options];
    
    // Remove user's previous vote if any
    updatedOptions = updatedOptions.map(opt => ({ ...opt, votes: opt.votes.filter(id => id !== currentUser.userId) }));
    // Add vote to new option
    updatedOptions[optionIndex].votes.push(currentUser.userId);

    await supabase.from("democracy_polls").update({ options: updatedOptions }).eq("id", pollId);
    fetchData();
  };

  const handleTogglePlanMember = async (planId) => {
    const plan = plans.find(p => p.id === planId);
    const isMember = plan.members?.some(m => m.id === currentUser.userId);
    let updatedMembers = plan.members || [];

    if (isMember) updatedMembers = updatedMembers.filter(m => m.id !== currentUser.userId);
    else updatedMembers.push({ id: currentUser.userId, name: currentUser.name });

    await supabase.from("democracy_plans").update({ members: updatedMembers }).eq("id", planId);
    fetchData();
  };

  const handleOpinionVote = async (opId, type) => {
    const op = opinions.find(o => o.id === opId);
    let ups = op.upvotes.filter(id => id !== currentUser.userId);
    let downs = op.downvotes.filter(id => id !== currentUser.userId);

    if (type === 'up' && !op.upvotes.includes(currentUser.userId)) ups.push(currentUser.userId);
    if (type === 'down' && !op.downvotes.includes(currentUser.userId)) downs.push(currentUser.userId);

    await supabase.from("democracy_opinions").update({ upvotes: ups, downvotes: downs }).eq("id", opId);
    fetchData();
  };

  // --- ADMIN LOGIC ---
  const handleAdminLogin = () => {
    if (passkeyInput === import.meta.env.VITE_ADMIN_PASSKEY) {
      setIsAdmin(true); setShowAdminLogin(false); setPasskeyInput("");
    } else alert("ACCESS DENIED");
  };

  const handleDelete = async (id, table) => {
    if (!window.confirm("EXECUTE DELETE?")) return;
    await supabase.from(table).delete().eq("id", id);
    fetchData();
  };

  return (
    <div className="democracy-wrapper terminal-wrapper full-width-override">
      <div className="widget">
        
        {/* HEADER & ADMIN */}
        <div className="widget-header purple-header flex-between">
          <span>TOWNHALL // DEMOCRACY HUB</span>
          <button className="action-text-btn" onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(!showAdminLogin)}>
            {isAdmin ? "SYS.ADMIN(ACTIVE)" : "SYS.LOGIN"}
          </button>
        </div>

        {showAdminLogin && !isAdmin && (
          <div className="admin-login-box m-3">
            <span className="prompt-symbol alert-text">root@townhall:~$</span>
            <input type="password" value={passkeyInput} onChange={e => setPasskeyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} placeholder="Enter Passkey" className="terminal-input" />
            <button className="execute-btn alert-btn" onClick={handleAdminLogin}>AUTH</button>
          </div>
        )}

        {/* TABS NAVIGATION */}
        <div className="townhall-tabs">
          <button className={`execute-btn ${activeTab === 'polls' ? 'purple-btn' : 'secondary-btn'}`} onClick={() => setActiveTab('polls')}>🗳️ POLLS</button>
          <button className={`execute-btn ${activeTab === 'plans' ? 'purple-btn' : 'secondary-btn'}`} onClick={() => setActiveTab('plans')}>📅 PLANS</button>
          <button className={`execute-btn ${activeTab === 'opinions' ? 'purple-btn' : 'secondary-btn'}`} onClick={() => setActiveTab('opinions')}>⚖️ OPINIONS</button>
        </div>

        <div className="townhall-content custom-scrollbar">
          
          {/* POLLS TAB */}
          {activeTab === "polls" && (
            <div className="tab-section">
              <form onSubmit={submitPoll} className="input-box mb-4">
                <input className="terminal-input mb-2" placeholder="Ask a question..." value={newPollQ} onChange={(e) => setNewPollQ(e.target.value)} />
                {pollOptions.map((opt, idx) => (
                  <input key={idx} className="terminal-input mb-1 option-input" placeholder={`Option ${idx + 1}`} value={opt} onChange={(e) => {
                    const newOpts = [...pollOptions];
                    newOpts[idx] = e.target.value;
                    setPollOptions(newOpts);
                  }} />
                ))}
                <div className="flex-between mt-2">
                  <button type="button" className="action-text-btn" onClick={() => setPollOptions([...pollOptions, ""])}>+ Add Option</button>
                  <button type="submit" className="execute-btn purple-btn">PUBLISH POLL</button>
                </div>
              </form>

              {loading ? <div className="terminal-log text-center">FETCHING...</div> : polls.map(poll => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes?.length || 0), 0);
                return (
                  <div key={poll.id} className="townhall-card">
                    <div className="flex-between">
                      <h3 className="card-title">{poll.question}</h3>
                      {isAdmin && <button className="action-text-btn alert-text" onClick={() => handleDelete(poll.id, 'democracy_polls')}>DEL</button>}
                    </div>
                    <div className="poll-options">
                      {poll.options.map((opt, idx) => {
                        const votes = opt.votes?.length || 0;
                        const percent = totalVotes === 0 ? 0 : Math.round((votes / totalVotes) * 100);
                        const hasVoted = opt.votes?.includes(currentUser.userId);
                        return (
                          <div key={idx} className={`poll-bar-container ${hasVoted ? 'voted' : ''}`} onClick={() => handleVotePoll(poll.id, idx)}>
                            <div className="poll-progress" style={{ width: `${percent}%` }}></div>
                            <div className="poll-label"><span>{opt.text}</span><span>{percent}% ({votes})</span></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* PLANS TAB */}
          {activeTab === "plans" && (
            <div className="tab-section">
              <form onSubmit={submitPlan} className="input-box mb-4">
                <input className="terminal-input mb-2" placeholder="Plan Title (e.g., Friday Drinks)" value={newPlan.title} onChange={e => setNewPlan({...newPlan, title: e.target.value})} />
                <input type="date" className="terminal-input mb-2" value={newPlan.date} onChange={e => setNewPlan({...newPlan, date: e.target.value})} />
                <textarea className="terminal-input mb-2" placeholder="Details/Location..." value={newPlan.description} onChange={e => setNewPlan({...newPlan, description: e.target.value})} />
                <div className="text-right"><button type="submit" className="execute-btn purple-btn">PROPOSE PLAN</button></div>
              </form>

              {loading ? <div className="terminal-log text-center">FETCHING...</div> : plans.map(plan => {
                const members = plan.members || [];
                const amIIn = members.some(m => m.id === currentUser.userId);
                return (
                  <div key={plan.id} className="townhall-card">
                    <div className="flex-between">
                      <div>
                        <h3 className="card-title">{plan.title}</h3>
                        <div className="text-dim text-sm mb-2">📅 {new Date(plan.plan_date).toDateString()}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isAdmin && <button className="action-text-btn alert-text" onClick={() => handleDelete(plan.id, 'democracy_plans')}>DEL</button>}
                        <button className={`execute-btn ${amIIn ? 'alert-btn' : 'purple-btn'}`} onClick={() => handleTogglePlanMember(plan.id)}>
                          {amIIn ? "OPTOUT" : "I'M IN"}
                        </button>
                      </div>
                    </div>
                    <p className="mb-3">{plan.description}</p>
                    <div className="onboard-list">
                      <span className="text-dim text-sm">Onboard ({members.length}): </span>
                      {members.map(m => <span key={m.id} className="member-badge">{m.name}</span>)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* OPINIONS TAB */}
          {activeTab === "opinions" && (
            <div className="tab-section">
              <form onSubmit={submitOpinion} className="input-box mb-4 text-right">
                <textarea className="terminal-input mb-2" placeholder="Hot takes go here..." value={newOpinion} onChange={e => setNewOpinion(e.target.value)} />
                <button type="submit" className="execute-btn purple-btn">DROP OPINION</button>
              </form>

              {loading ? <div className="terminal-log text-center">FETCHING...</div> : opinions.map(op => {
                const upvotes = op.upvotes?.length || 0;
                const downvotes = op.downvotes?.length || 0;
                const score = upvotes - downvotes;
                const myVote = op.upvotes?.includes(currentUser.userId) ? 'up' : op.downvotes?.includes(currentUser.userId) ? 'down' : null;

                return (
                  <div key={op.id} className="townhall-card flex gap-4">
                    <div className="vote-column">
                      <button className={`vote-arrow ${myVote === 'up' ? 'active-up' : ''}`} onClick={() => handleOpinionVote(op.id, 'up')}>▲</button>
                      <span className={`vote-score ${score > 0 ? 'text-green' : score < 0 ? 'alert-text' : ''}`}>{score}</span>
                      <button className={`vote-arrow ${myVote === 'down' ? 'active-down' : ''}`} onClick={() => handleOpinionVote(op.id, 'down')}>▼</button>
                    </div>
                    <div className="opinion-content flex-grow">
                      <div className="flex-between mb-1">
                        <span className="text-dim text-sm">{new Date(op.created_at).toLocaleString()}</span>
                        {isAdmin && <button className="action-text-btn alert-text" onClick={() => handleDelete(op.id, 'democracy_opinions')}>DEL</button>}
                      </div>
                      <p>{op.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Democracy;