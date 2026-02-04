import React, { useState } from "react";
import "./HamburgerMennu.css"; // Ensure this filename matches your actual file
import ConfessionPopup from "../Confessions/ConfessionPopup";
import MovieRatingPopup from "../MovieReview/MovieRatingPopup";

const HamburgerMenu = ({ onClick, setShowQuiz }) => {
  const [showConfessions, setShowConfessions] = useState(false);
  const [showMovies, setShowMovies] = useState(false);
  // const [showQuiz, setShowQuiz] = useState(false);

  return (
    <div className="hamburger-menu-container flex items-center gap-4">
      {/* Existing Menu Button */}
      <button className="hamburger-menu-button  hamburger-menu" onClick={onClick}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>

        <span>Menu</span>
      </button>

      {/* New Confessions Button */}
      <button
        className="hamburger-menu-button confession-btn confession-mark"
        onClick={() => setShowConfessions(true)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>

        <span>Confess</span>
      </button>

      {/* New Movie Suggestions Button */}
      <button
        className="hamburger-menu-button confession-btn movies-mark"
        onClick={() => setShowMovies(true)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <polygon points="10 9 16 12 10 15 10 9" />
        </svg>

        <span>Movies</span>
      </button>

      {/* Quiz Button */}
      <button
        className="hamburger-menu-button confession-btn quiz-mark"
        onClick={() => setShowQuiz(true)}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >

          <rect x="4" y="3" width="16" height="18" rx="2" ry="2" />
          <path d="M9 3h6v4H9z" />


          <path d="M12 10a2.5 2.5 0 0 1 2.5 2.5c0 1.5-2.5 2-2.5 3" />
          <circle cx="12" cy="17" r="0.5" />
        </svg>

        <span>Quiz</span>
      </button>

      {/* Popup Component */}
      <ConfessionPopup
        open={showConfessions}
        onClose={() => setShowConfessions(false)}
      />

      {/* MovieRating Component */}
      <MovieRatingPopup
        open={showMovies}
        onClose={() => setShowMovies(false)}
      />
    </div>
  );
};

export default HamburgerMenu;
