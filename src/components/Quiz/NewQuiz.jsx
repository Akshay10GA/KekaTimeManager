import React, { useState, useEffect } from "react";
import "./NewQuiz.css";
import { quizData } from "./quizData";
import { supabase } from "../../supabaseClient"; // Import Supabase connection

const NewQuiz = ({ setShowQuiz }) => {
  const [gameState, setGameState] = useState("menu");

  // Keep username in LocalStorage so the browser remembers the player
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("quizLastUser") || "";
  });

  const [category, setCategory] = useState("");
  const [finalScore, setFinalScore] = useState(0);

  const startGame = (selectedCategory) => {
    if (!userName.trim()) {
      alert("Identify yourself, User.");
      return;
    }
    // Save username locally for convenience
    localStorage.setItem("quizLastUser", userName);
    setCategory(selectedCategory);
    setGameState("playing");
  };

  const endGame = (score) => {
    setFinalScore(score);
    setGameState("gameover");
  };

  const resetGame = () => {
    setGameState("menu");
    setCategory("");
    setFinalScore(0);
  };

  return (
    <div className="quiz-widget-wrapper">
      <div className="quiz-content fade-in">
        {gameState === "menu" && (
          <MenuScreen
            userName={userName}
            setUserName={setUserName}
            onStart={startGame}
            onViewLeaderboard={() => setGameState("leaderboard")}
            setShowQuiz={setShowQuiz}
          />
        )}

        {gameState === "leaderboard" && (
          <LeaderboardScreen onBack={() => setGameState("menu")} />
        )}

        {gameState === "playing" && (
          <QuizScreen
            userName={userName}
            category={category}
            onGameEnd={endGame}
          />
        )}

        {gameState === "gameover" && (
          <GameOverScreen
            score={finalScore}
            userName={userName}
            category={category}
            onReset={resetGame}
          />
        )}
      </div>
    </div>
  );
};

// --- Component: Menu Screen ---
const MenuScreen = ({ userName, setUserName, onStart, onViewLeaderboard, setShowQuiz }) => {
  const [isConfirmed, setIsConfirmed] = useState(!!userName); 

  const handleConfirm = () => {
    if (userName.trim()) {
      localStorage.setItem("quizLastUser", userName);
      setIsConfirmed(true);
    }
  };

  const handleEdit = () => {
    setIsConfirmed(false);
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: "10px 0",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>System Login</h2>
        <button
          style={{
            position: "absolute",
            right: "0",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "20px",
            color: "white",
            padding: "5px 10px"
          }}
          onClick={() => setShowQuiz(false)}
        >
          ✕
        </button>
      </div>

      <div style={{ margin: "20px 0", display: "flex", gap: "10px", justifyContent: "center" }}>
        {isConfirmed ? (
          <div 
            className="input-field" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between", 
              color: "#00f3ff",
              border: "1px solid #00f3ff",
              cursor: "default"
            }}
          >
            <span>AGENT: {userName}</span>
            <span 
              onClick={handleEdit} 
              style={{ cursor: "pointer", fontSize: "12px", opacity: 0.7, marginLeft: "10px" }}
            >
              (EDIT)
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", width: "100%", gap: "8px" }}>
            <input
              type="text"
              className="input-field"
              placeholder="ENTER USERNAME"
              value={userName}
              autoComplete="off"
              onChange={(e) => setUserName(e.target.value)}
              style={{ flex: 1, margin: 0 }}
              onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
            />
            <button 
              className="btn" 
              onClick={handleConfirm}
              style={{ padding: "0 15px", whiteSpace: "nowrap" }}
            >
              CONFIRM
            </button>
          </div>
        )}
      </div>

      <p style={{ color: "#a0a0a0", marginBottom: "15px", fontSize: "0.8rem", opacity: isConfirmed ? 1 : 0.5 }}>
        SELECT QUESTION SET
      </p>

      <div 
        className="category-grid" 
        style={{ 
          opacity: isConfirmed ? 1 : 0.4, 
          pointerEvents: isConfirmed ? "all" : "none",
          transition: "opacity 0.3s" 
        }}
      >
        {Object.keys(quizData).map((cat) => (
          <button key={cat} className="btn" onClick={() => onStart(cat)}>
            {cat}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "20px",
          borderTop: "1px solid var(--glass-border)",
          paddingTop: "15px",
        }}
      >
        <button
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={onViewLeaderboard}
        >
          ACCESS RECORDS (HIGHSCORES)
        </button>
      </div>
    </div>
  );
};

// --- Component: Leaderboard Screen (UPDATED FOR SUPABASE) ---
const LeaderboardScreen = ({ onBack }) => {
  const categories = Object.keys(quizData);
  const [activeTab, setActiveTab] = useState(categories[0]);
  const [highScores, setHighScores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchScores();
  }, [activeTab]);

  const fetchScores = async () => {
    setLoading(true);
    try {
      // Retrieve top 10 scores for the active category
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('category', activeTab)
        .order('score', { ascending: false })
        .limit(10);

      if (error) throw error;
      setHighScores(data || []);
    } catch (err) {
      console.error("Error fetching leaderboard:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        width: "100%",
        textAlign: "center",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ marginTop: 0 }}>DATABASE RECORDS</h3>

      <div className="filter-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeTab === cat ? "active" : ""}`}
            onClick={() => setActiveTab(cat)}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto", width: "100%" }}>
        {loading ? (
          <div style={{ padding: "20px", color: "#00f3ff" }}>CONNECTING TO DB...</div>
        ) : (
          <table className="highscore-table">
            <thead>
              <tr>
                <th>RNK</th>
                <th>AGENT</th>
                <th style={{ textAlign: "right" }}>PTS</th>
              </tr>
            </thead>
            <tbody>
              {highScores.length > 0 ? (
                highScores.map((entry, index) => (
                  <tr key={index}>
                    <td style={index === 0 ? { color: "#ffd700" } : {}}>
                      #{index + 1}
                    </td>
                    {/* Supabase column names are 'username' and 'score' */}
                    <td>{entry.username}</td> 
                    <td style={{ textAlign: "right" }}>{entry.score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    style={{
                      textAlign: "center",
                      color: "#a0a0a0",
                      padding: "30px 0",
                    }}
                  >
                    NO ENTRIES FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div style={{ marginTop: "15px" }}>
        <button
          className="btn btn-secondary"
          style={{ width: "100%" }}
          onClick={onBack}
        >
          RETURN TO MENU
        </button>
      </div>
    </div>
  );
};

// --- Component: Quiz Screen (No Changes) ---
const QuizScreen = ({ category, onGameEnd, userName }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerProcessed, setIsAnswerProcessed] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const loadedQuestions = quizData[category] || [];
    const shuffledQuestions = shuffleArray([...loadedQuestions]);
    setQuestions(shuffledQuestions);
    if (shuffledQuestions.length > 0) {
      setShuffledOptions(shuffleArray([...shuffledQuestions[0].options]));
    }
  }, [category]);

  useEffect(() => {
    if (isAnswerProcessed) return;

    if (timeLeft === 0) {
      handleTimeout();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, isAnswerProcessed]);

  const handleTimeout = () => {
    setIsAnswerProcessed(true);
    setLives((prev) => prev - 1);
  };

  const handleOptionClick = (option) => {
    if (isAnswerProcessed) return;

    setSelectedOption(option);
    setIsAnswerProcessed(true);

    const currentQuestion = questions[currentIndex];
    if (option === currentQuestion.answer) {
      setScore((prev) => prev + 10);
    } else {
      setLives((prev) => prev - 1);
    }
  };

  const handleNextQuestion = () => {
    if (lives === 0) {
      onGameEnd(score);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setTimeLeft(20);
      setSelectedOption(null);
      setIsAnswerProcessed(false);
      setShuffledOptions(shuffleArray([...questions[nextIndex].options]));
    } else {
      onGameEnd(score);
    }
  };

  if (questions.length === 0 || shuffledOptions.length === 0)
    return <div>Initializing Data...</div>;

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  return (
    <div className="fade-in" style={{ width: "100%" }}>
      <div className="stats-bar">
        <span>PTS: {score}</span>
        <span className={`timer ${timeLeft <= 5 ? "danger" : ""}`}>
          T-{timeLeft}s
        </span>
        <span
          style={{
            color: "#ff003c",
            textShadow: "0 0 5px #ff003c",
            transform: "scale(1.8)",
          }}
        >
          {"♥".repeat(lives)}
        </span>
      </div>

      <div className="question-section">
        <p style={{ fontSize: "0.8rem", color: "#a0a0a0" }}>
          QUERY {currentIndex + 1} / {questions.length}
        </p>
        <div className="question-text">{currentQuestion.question}</div>

        <div className="options-list">
          {shuffledOptions.map((opt) => {
            let btnClass = "option-btn";
            if (isAnswerProcessed) {
              if (opt === currentQuestion.answer) btnClass += " correct";
              else if (opt === selectedOption) btnClass += " wrong";
            }

            return (
              <button
                key={opt}
                className={btnClass}
                onClick={() => handleOptionClick(opt)}
                disabled={isAnswerProcessed}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {isAnswerProcessed && (
        <div className="fade-in">
          <div className="explanation-box">
            <div className="explanation-title">Explanation:</div>
            <div className="explanation-text">
              {currentQuestion.explanation || "No additional data available."}
            </div>
          </div>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {lives === 0 ? (
              <p style={{ color: "#ff003c", fontWeight: "bold" }}>
                SYSTEM FAILURE: 0 LIVES REMAINING
              </p>
            ) : timeLeft === 0 ? (
              <p style={{ color: "#ff003c" }}>TIME EXPIRED</p>
            ) : (
              <p style={{ color: "#00f3ff" }}>ANSWER RECORDED</p>
            )}

            <button
              className="btn"
              style={{
                width: "100%",
                background: lives === 0 ? "#ff003c" : undefined,
                color: lives === 0 ? "white" : undefined,
              }}
              onClick={handleNextQuestion}
            >
              {lives === 0
                ? "TERMINATE SESSION"
                : isLastQuestion
                ? "COMPLETE MISSION"
                : "NEXT QUESTION >>"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Component: Game Over Screen (UPDATED FOR SUPABASE) ---
const GameOverScreen = ({ score, userName, category, onReset }) => {
  const [highScores, setHighScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    saveAndFetchScores();
  }, []);

  const saveAndFetchScores = async () => {
    try {
      // 1. Insert Score into Supabase
      const { error: insertError } = await supabase
        .from('leaderboard')
        .insert([{ username: userName, score: score, category: category }]);

      if (insertError) console.error("Error saving score:", insertError.message);

      // 2. Fetch Top 5 for this category to display
      const { data, error: fetchError } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('category', category)
        .order('score', { ascending: false })
        .limit(5);

      if (fetchError) throw fetchError;
      setHighScores(data || []);

    } catch (err) {
      console.error("Game Over operation failed:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in" style={{ width: "100%", textAlign: "center" }}>
      <h2 style={{ color: "#ff003c", textShadow: "0 0 10px #ff003c" }}>
        SESSION ENDED
      </h2>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            color: "#a0a0a0",
          }}
        >
          {category} / Final Score
        </p>
        <h1 style={{ margin: "10px 0", fontSize: "3rem", color: "#fff" }}>
          {score}
        </h1>
      </div>

      <h3 style={{ fontSize: "1rem" }}>{category.toUpperCase()} LEADERBOARD</h3>

      {loading ? (
         <div style={{ padding: "20px", color: "#a0a0a0" }}>SAVING DATA...</div>
      ) : (
        <table className="highscore-table">
          <thead>
            <tr>
              <th>RNK</th>
              <th>AGENT</th>
              <th style={{ textAlign: "right" }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {highScores.length > 0 ? (
              highScores.map((entry, index) => (
                <tr
                  key={index}
                  style={
                    // Highlight the current user's entry if it appears in top 5
                    entry.username === userName && entry.score === score
                      ? {
                          color: "#00f3ff",
                          textShadow: "0 0 5px rgba(0,243,255,0.5)",
                          fontWeight: "bold",
                        }
                      : {}
                  }
                >
                  <td>{index + 1}</td>
                  <td>{entry.username}</td>
                  <td style={{ textAlign: "right" }}>{entry.score}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  style={{
                    textAlign: "center",
                    color: "#a0a0a0",
                    padding: "20px",
                  }}
                >
                  NO DATA FOUND
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: "25px" }}>
        <button className="btn" style={{ width: "100%" }} onClick={onReset}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default NewQuiz;