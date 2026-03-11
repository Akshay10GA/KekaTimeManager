import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import { quizData } from "./quizData";
import "./NewQuiz.css";

const NewQuiz = () => {
  const categories = Object.keys(quizData);

  // --- GAME STATE ---
  const [gameState, setGameState] = useState("start"); // 'start', 'playing', 'gameover'
  const [playerName, setPlayerName] = useState(() => localStorage.getItem("quizLastUser") || "");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // --- PLAYING STATE ---
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerProcessed, setIsAnswerProcessed] = useState(false);

  // --- LEADERBOARD STATE ---
  const [leaderboard, setLeaderboard] = useState([]);
  const [boardCategory, setBoardCategory] = useState(categories[0]);
  const [loadingBoard, setLoadingBoard] = useState(false);

  // --- UTILS ---
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // --- LIFECYCLE: TIMER ---
  useEffect(() => {
    if (gameState !== "playing" || isAnswerProcessed) return;

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, isAnswerProcessed, gameState]);

  // --- LIFECYCLE: LEADERBOARD ---
  useEffect(() => {
    fetchLeaderboard(boardCategory);
  }, [boardCategory]);

  const fetchLeaderboard = async (cat) => {
    setLoadingBoard(true);
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .eq("category", cat)
      .order("score", { ascending: false })
      .limit(10);
      
    if (!error && data) setLeaderboard(data);
    setLoadingBoard(false);
  };

  const submitScore = async (finalScore, cat) => {
    const { error } = await supabase.from("leaderboard").insert([{ 
      username: playerName || "Anonymous Analyst", 
      score: finalScore, 
      category: cat 
    }]);

    if (!error) {
      if (boardCategory === cat) fetchLeaderboard(cat);
    }
  };

  // --- GAME LOGIC ---
  const startQuiz = (cat) => {
    if (!playerName.trim()) return;
    localStorage.setItem("quizLastUser", playerName);
    
    const loadedQuestions = quizData[cat] || [];
    const shuffledQs = shuffleArray([...loadedQuestions]).slice(0, 10); // Optionally limit to 10 questions per run
    
    if (shuffledQs.length === 0) return;

    setQuestions(shuffledQs);
    setShuffledOptions(shuffleArray([...shuffledQs[0].options]));
    setSelectedCategory(cat);
    setBoardCategory(cat); // Sync leaderboard view to current game
    
    setCurrentQIndex(0);
    setScore(0);
    setLives(3);
    setTimeLeft(20);
    setSelectedOption(null);
    setIsAnswerProcessed(false);
    
    setGameState("playing");
  };

  const handleTimeout = () => {
    setIsAnswerProcessed(true);
    setLives((prev) => prev - 1);
  };

  const handleOptionClick = (option) => {
    if (isAnswerProcessed) return;

    setSelectedOption(option);
    setIsAnswerProcessed(true);

    if (option === questions[currentQIndex].answer) {
      setScore((prev) => prev + 10);
    } else {
      setLives((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (lives === 0) {
      endGame();
      return;
    }

    const nextIndex = currentQIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQIndex(nextIndex);
      setTimeLeft(20);
      setSelectedOption(null);
      setIsAnswerProcessed(false);
      setShuffledOptions(shuffleArray([...questions[nextIndex].options]));
    } else {
      endGame();
    }
  };

  const endGame = () => {
    submitScore(score, selectedCategory);
    setGameState("gameover");
  };

  const resetQuiz = () => {
    setGameState("start");
  };

  return (
    <div className="quiz-wrapper terminal-wrapper full-width-override">
      <div className="quiz-grid">
        
        {/* LEFT COLUMN: ACTIVE TERMINAL */}
        <div className="widget cyan-widget flex-col">
          <div className="widget-header cyan-header">SYS.DIAGNOSTICS // BRAIN BREAK</div>

          {/* STATE: START */}
          {gameState === "start" && (
            <div className="quiz-start-screen flex-col-center">
              <div className="diagnostic-icon mb-4">🧠</div>
              <h2 className="cyan-text text-xl mb-2 text-center">INITIATE COGNITIVE TEST</h2>
              
              <div className="terminal-prompt-container cyan-border mb-4 w-full max-w-sm">
                <span className="prompt-symbol cyan-text">ALIAS:</span>
                <input 
                  type="text" 
                  className="terminal-input" 
                  placeholder="Enter Agent Name..." 
                  value={playerName} 
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={15}
                />
              </div>
              
              <div className="stat-key mb-2 text-center">SELECT DATABANK TO BEGIN:</div>
              <div className="category-grid-cyan w-full max-w-sm">
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    className="execute-btn cyan-btn" 
                    onClick={() => startQuiz(cat)} 
                    disabled={!playerName.trim()}
                  >
                    {cat.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STATE: PLAYING */}
          {gameState === "playing" && questions.length > 0 && (
            <div className="quiz-playing-screen flex-col flex-1">
              {/* HUD */}
              <div className="quiz-hud flex-between mb-4">
                <div className="hud-stat">
                  <span className="stat-key">QUERY</span>
                  <span className="stat-val cyan-text">{currentQIndex + 1}/{questions.length}</span>
                </div>
                <div className="hud-stat text-center">
                  <span className="stat-key">TIME</span>
                  <span className={`stat-val ${timeLeft <= 5 ? "alert-text blink" : "cyan-text"}`}>
                    00:{timeLeft.toString().padStart(2, "0")}
                  </span>
                </div>
                <div className="hud-stat text-center">
                  <span className="stat-key">INTEGRITY</span>
                  <span className="stat-val alert-text" style={{ fontSize: '1.5rem', letterSpacing: '2px' }}>
                    {"♥".repeat(lives)}
                    <span style={{opacity: 0.2}}>{"♥".repeat(3 - lives)}</span>
                  </span>
                </div>
                <div className="hud-stat text-right">
                  <span className="stat-key">SCORE</span>
                  <span className="stat-val cyan-text">{score}</span>
                </div>
              </div>

              {/* Question */}
              <div className="quiz-question-box mb-4">
                {questions[currentQIndex].question}
              </div>

              {/* Options */}
              <div className="quiz-options-grid mb-4">
                {shuffledOptions.map((opt, idx) => {
                  let btnClass = "quiz-option-btn";
                  let prefix = "[ ? ]";

                  if (isAnswerProcessed) {
                    if (opt === questions[currentQIndex].answer) {
                      btnClass += " correct-option";
                      prefix = "[ ✓ ]";
                    } else if (opt === selectedOption) {
                      btnClass += " wrong-option";
                      prefix = "[ ✕ ]";
                    }
                  }

                  return (
                    <button 
                      key={idx} 
                      className={btnClass} 
                      onClick={() => handleOptionClick(opt)}
                      disabled={isAnswerProcessed}
                    >
                      <span className="option-prefix">{prefix}</span> {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback & Explanation */}
              {isAnswerProcessed && (
                <div className="explanation-container mt-auto">
                  <div className={`terminal-log mb-2 font-bold ${selectedOption === questions[currentQIndex].answer ? 'cyan-text' : 'alert-text'}`}>
                    {selectedOption === questions[currentQIndex].answer ? "[ ACCEPTED: +10 PTS ]" : "[ REJECTED: SYSTEM INTEGRITY COMPROMISED ]"}
                  </div>
                  <div className="explanation-box mb-3">
                    <span className="stat-key block mb-1">DATA LOG:</span>
                    {questions[currentQIndex].explanation || "No additional data available."}
                  </div>
                  <button 
                    className={`execute-btn w-full ${lives === 0 ? "alert-btn" : "cyan-btn"}`} 
                    onClick={handleNextQuestion}
                  >
                    {lives === 0 ? "TERMINATE SESSION" : (currentQIndex === questions.length - 1 ? "COMPLETE MISSION" : "NEXT QUERY >>")}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STATE: FINISHED */}
          {gameState === "gameover" && (
            <div className="quiz-result-screen flex-col-center">
              <h2 className={`text-xl mb-2 ${lives === 0 ? "alert-text" : "cyan-text"}`}>
                {lives === 0 ? "SYSTEM FAILURE" : "DIAGNOSTIC COMPLETE"}
              </h2>
              
              <div className="terminal-log mb-4">DATABANK: {selectedCategory.toUpperCase()}</div>

              <div className="result-stats-grid mb-4 w-full max-w-sm">
                <div className={`result-box ${lives === 0 ? "alert-border" : "cyan-border"}`}>
                  <span className="stat-key">FINAL SCORE</span>
                  <span className={`progress-value-large ${lives === 0 ? "alert-text" : "cyan-text"}`}>{score}</span>
                </div>
              </div>

              <button className="execute-btn cyan-btn w-full max-w-sm mt-4" onClick={resetQuiz}>
                RETURN TO MAIN MENU
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LEADERBOARD */}
        <div className="widget cyan-widget leaderboard-column flex-col">
          <div className="widget-header cyan-header flex-between">
            <span>NETWORK // GLOBAL LEADERBOARD</span>
          </div>

          <div className="leaderboard-tabs mb-3">
            {categories.map(cat => (
              <button 
                key={cat} 
                className={`tab-btn ${boardCategory === cat ? 'active' : ''}`}
                onClick={() => setBoardCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="leaderboard-container custom-scrollbar-cyan flex-1">
            {loadingBoard ? (
              <div className="terminal-log text-center mt-4">SYNCING DATA...</div>
            ) : leaderboard.length === 0 ? (
              <div className="terminal-log text-center mt-4 alert-text">[ NO DATA FOUND FOR THIS DATABANK ]</div>
            ) : (
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>RNK</th>
                    <th>AGENT</th>
                    <th className="text-right">PTS</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => {
                    // Highlight the current user's latest score dynamically
                    const isCurrentUser = gameState === "gameover" && entry.username === playerName && entry.score === score && boardCategory === selectedCategory;
                    
                    return (
                      <tr key={entry.id || idx} className={`${idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : idx === 2 ? "rank-3" : ""} ${isCurrentUser ? "current-user-highlight" : ""}`}>
                        <td className="rank-col">
                          {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `0${idx + 1}`}
                        </td>
                        <td className="alias-col">{entry.username}</td>
                        <td className="score-col text-right cyan-text">{entry.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default NewQuiz;