import { useState, useEffect } from 'react';
import './Quix.css';

interface Question {
  question: string;
  options: string[];
  answer: string;
}

interface QuizData {
  questions: Question[];
}

interface HighScore {
  username: string;
  score: number;
}

// Boilerplate API functions
const API_ENDPOINT = 'YOUR_API_ENDPOINT_HERE'; // Replace with your actual API endpoint

// Function to save high score to API
const saveHighScoreToAPI = async (username: string, score: number) => {
  try {
    const response = await fetch(`${API_ENDPOINT}/highscore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers here
        // 'Authorization': 'Bearer YOUR_TOKEN'
      },
      body: JSON.stringify({
        username,
        score,
        timestamp: new Date().toISOString()
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save high score');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving high score to API:', error);
    throw error;
  }
};

// Function to get high score from API
const getHighScoreFromAPI = async () => {
  try {
    const response = await fetch(`${API_ENDPOINT}/highscore`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers here
        // 'Authorization': 'Bearer YOUR_TOKEN'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch high score');
    }
    
    const data = await response.json();
    return data; // Assuming API returns { username: string, score: number }
  } catch (error) {
    console.error('Error fetching high score from API:', error);
    throw error;
  }
};

export default function Quiz({ quizData }: { quizData: QuizData }) {
  const [gameState, setGameState] = useState<'username' | 'playing' | 'gameover'>('username');
  const [username, setUsername] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState<HighScore>({ username: '', score: 0 });
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [askedQuestions, setAskedQuestions] = useState<number[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Load high score on mount
  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('quizHighScore');
    if (savedHighScore) {
      setHighScore(JSON.parse(savedHighScore));
    }

    // Load saved username from localStorage
    const savedUsername = localStorage.getItem('quizUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    }

    // Uncomment below to fetch high score from API instead
    // fetchHighScoreFromAPI();
  }, []);

  // Function to fetch high score from API
  const fetchHighScoreFromAPI = async () => {
    try {
      const apiHighScore = await getHighScoreFromAPI();
      setHighScore(apiHighScore);
    } catch (error) {
      // Fallback to localStorage if API fails
      const savedHighScore = localStorage.getItem('quizHighScore');
      if (savedHighScore) {
        setHighScore(JSON.parse(savedHighScore));
      }
    }
  };

  // Start game with username
  const startGame = () => {
    if (username.trim() === '') return;
    
    // Save username to localStorage
    localStorage.setItem('quizUsername', username.trim());
    
    const shuffled = [...quizData.questions].sort(() => Math.random() - 10);
    setQuestions(shuffled);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setAskedQuestions([]);
    setShuffledOptions([...shuffled[0].options].sort(() => Math.random() - 0.5));
    setGameState('playing');
  };

  // Handle answer selection
  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    // Check if answer is correct
    if (option === questions[currentQuestionIndex].answer) {
      const newScore = score + 1;
      setScore(newScore);
    } else {
      // Wrong answer - game over!
      setTimeout(() => {
        endGame();
      }, 2000);
    }
  };

  // End game and check for high score
  const endGame = () => {
    if (score > highScore.score) {
      const newHighScore = { username, score };
      setHighScore(newHighScore);
      localStorage.setItem('quizHighScore', JSON.stringify(newHighScore));
      
      // Uncomment below to save to API
      // saveHighScoreToAPI(username, score).catch(err => {
      //   console.error('Failed to save high score to API:', err);
      // });
    }
    setGameState('gameover');
  };

  // Move to next question
  const handleNext = () => {
    // Find next unanswered question
    const nextIndex = questions.findIndex((_, idx) => !askedQuestions.includes(idx) && idx !== currentQuestionIndex);

    if (nextIndex !== -1) {
      setAskedQuestions([...askedQuestions, currentQuestionIndex]);
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShuffledOptions([...questions[nextIndex].options].sort(() => Math.random() - 0.5));
    } else {
      // No more questions - player won!
      setTimeout(() => {
        endGame();
      }, 1000);
    }
  };

  // Restart game
  const restartGame = () => {
    setGameState('username');
    // Keep the username so user can change it if they want
    const savedUsername = localStorage.getItem('quizUsername');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  };

  // Clear username and use a new one
  const useNewUsername = () => {
    setUsername('');
    localStorage.removeItem('quizUsername');
    setGameState('username');
  };

  // Get button style based on answer state
  const getButtonClassName = (option: string) => {
    if (!isAnswered) {
      return 'option-button option-button-default';
    }

    if (option === questions[currentQuestionIndex].answer) {
      return 'option-button option-button-correct';
    }

    if (option === selectedAnswer && option !== questions[currentQuestionIndex].answer) {
      return 'option-button option-button-incorrect';
    }

    return 'option-button option-button-disabled';
  };

  // Username screen
  if (gameState === 'username') {
    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="mb-6">
            <h1 className="quiz-title">🎮 Quiz Master</h1>
            <p className="quiz-subtitle">Test your knowledge and beat the high score!</p>
          </div>

          {highScore.score > 0 && (
            <div className="highscore-banner">
              <div className="highscore-content">
                <div>
                  <p className="highscore-label">🏆 Current Champion</p>
                  <p className="text-gray-900">{highScore.username}</p>
                </div>
                <div>
                  <p className="highscore-label">High Score</p>
                  <p className="highscore-value">{highScore.score}</p>
                </div>
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">Enter Your Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && startGame()}
              placeholder="Your username"
              className="form-input"
              maxLength={20}
            />
          </div>

          <button
            onClick={startGame}
            disabled={username.trim() === ''}
            className="btn-primary"
          >
            🚀 Start Quiz
          </button>

          <div className="warning-box">
            <p className="warning-text">⚠️ One wrong answer and you're out!</p>
          </div>
        </div>
      </div>
    );
  }

  // Game over screen
  if (gameState === 'gameover') {
    const isNewHighScore = score > 0 && score >= highScore.score;
    const didWin = askedQuestions.length + 1 === questions.length;

    return (
      <div className="quiz-container">
        <div className="quiz-card">
          <div className="mb-6">
            {isNewHighScore ? (
              <>
                <div className="gameover-icon">🏆</div>
                <h2 className="gameover-title-champion">New Champion!</h2>
                <p className="text-gray-600">Congratulations {username}, you set a new high score!</p>
              </>
            ) : didWin ? (
              <>
                <div className="gameover-icon">🎉</div>
                <h2 className="gameover-title-perfect">Perfect Score!</h2>
                <p className="text-gray-600">You answered all questions correctly!</p>
              </>
            ) : (
              <>
                <div className="gameover-icon">😅</div>
                <h2 className="gameover-title-lost">Game Over!</h2>
                <p className="text-gray-600">Better luck next time, {username}!</p>
              </>
            )}
          </div>

          <div className="score-box">
            <p className="score-label">Your Score</p>
            <p className="score-value">{score}</p>
            
            {isNewHighScore ? (
              <div className="new-highscore-badge">
                <p className="new-highscore-text">🏆 NEW HIGH SCORE! 🏆</p>
              </div>
            ) : (
              <div className="score-to-beat">
                <p className="score-to-beat-label">High Score to Beat</p>
                <p className="score-to-beat-value">{highScore.username}: {highScore.score}</p>
              </div>
            )}
          </div>

          <button
            onClick={restartGame}
            className="btn-primary"
          >
            🔄 Play Again
          </button>

          <button
            onClick={useNewUsername}
            className="btn-secondary"
          >
            Use New Username
          </button>
        </div>
      </div>
    );
  }

  // Playing screen
  const currentQuestion = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.answer;

  return (
    <div className="quiz-container">
      <div className="quiz-card quiz-card-large">
        {/* Header */}
        <div className="game-header">
          <div className="game-stats">
            <div className="stat-badge-purple">
              <p>👤 {username}</p>
            </div>
            <div className="stat-badge-green">
              <p>✓ {score}</p>
            </div>
          </div>
          <div className="stat-badge-orange">
            <p>🏆 {highScore.score}</p>
          </div>
        </div>

        {/* Question Counter */}
        <div className="question-counter">
          <span className="question-badge">
            Question {askedQuestions.length + 1} / {questions.length}
          </span>
        </div>

        {/* Question */}
        <div className="question-box">
          <h2 className="text-gray-800">{currentQuestion.question}</h2>
        </div>

        {/* Options */}
        <div className="options-container">
          {shuffledOptions.map((option, index) => {
            const isCorrectOption = option === currentQuestion.answer;
            const isSelectedOption = option === selectedAnswer;
            const showWhiteText = isAnswered && (isCorrectOption || isSelectedOption);
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                className={getButtonClassName(option)}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={showWhiteText ? 'option-text option-text-white' : 'option-text'}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Feedback & Next Button */}
        {isAnswered && (
          <div className="feedback-container">
            {isCorrect ? (
              <>
                <div className="feedback-correct">
                  <p className="feedback-correct-text">🎉 Correct! Keep going!</p>
                </div>
                <button
                  onClick={handleNext}
                  className="btn-next"
                >
                  Next Question →
                </button>
              </>
            ) : (
              <div className="feedback-incorrect">
                <p className="feedback-incorrect-title">❌ Wrong Answer!</p>
                <p className="feedback-incorrect-answer">Correct answer: {currentQuestion.answer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}