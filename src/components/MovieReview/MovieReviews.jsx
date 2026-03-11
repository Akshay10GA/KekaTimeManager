import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "../../supabaseClient";
import "./MovieReviews.css";

const ADMIN_KEY = import.meta.env.VITE_ADMIN_PASSKEY;
const STORAGE_USER = "anon_user_hash";

// --- HELPERS ---
const getUserHash = () => {
  let hash = localStorage.getItem(STORAGE_USER);
  if (!hash) {
    hash = crypto.randomUUID();
    localStorage.setItem(STORAGE_USER, hash);
  }
  return hash;
};

const normalize = (t) => t.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();

const filterProfanity = (text) => {
  const badWords = [
    "porn", "sex", "boobs", "boob", "dick", "pussy", "mastrubation", "masturbation",
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "whore", "slut",
    "rape", "damn", "cock", "suck", "nigger", "fag", "dyke", "retard", "piss", "gdtc", "godigital", "go digital"
  ];
  let cleaned = text;
  badWords.sort((a, b) => b.length - a.length).forEach((word) => {
    cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, "gi"), "***");
  });
  return cleaned;
};

// --- CUSTOM STAR RATING COMPONENT ---
const StarRating = ({ rating, setRating, readOnly = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="star-rating-container" onMouseLeave={() => setHoverRating(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hoverRating || rating) ? "filled" : "empty"} ${readOnly ? "readonly" : "interactive"}`}
          onClick={() => !readOnly && setRating(star)}
          onMouseEnter={() => !readOnly && setHoverRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---
const MovieReviews = () => {
  const userHash = useMemo(() => getUserHash(), []);

  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Add movie
  const [newTitle, setNewTitle] = useState("");

  // Review
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Edit review
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminInput, setAdminInput] = useState("");

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("movies")
      .select(`id, title, created_by, created_at, reviews (id, rating, comment, user_hash, created_at)`)
      .order("created_at", { ascending: false });

    setMovies(data || []);
    setLoading(false);
  };

  const selectedMovie = movies.find(m => m.id === selectedId) || null;
  const avgRating = (m) => m.reviews?.length ? (m.reviews.reduce((a, r) => a + r.rating, 0) / m.reviews.length).toFixed(1) : "0.0";
  const alreadyReviewed = selectedMovie?.reviews.some(r => r.user_hash === userHash);

  // --- ACTIONS ---
  const addMovie = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const cleanTitle = filterProfanity(newTitle.trim());
    if (movies.some(m => normalize(m.title) === normalize(cleanTitle))) {
      alert("[SYS] RECORD ALREADY EXISTS IN DATABASE.");
      return;
    }

    await supabase.from("movies").insert([{ title: cleanTitle, created_by: userHash }]);
    setNewTitle("");
    fetchMovies();
  };

  const submitReview = async () => {
    if (!rating || !selectedMovie) return;
    const cleanComment = filterProfanity(comment);

    await supabase.from("reviews").insert([{
      movie_id: selectedMovie.id, rating, comment: cleanComment, user_hash: userHash
    }]);

    setRating(0);
    setComment("");
    fetchMovies();
  };

  const updateReview = async (id) => {
    const cleanEdit = filterProfanity(editComment);
    await supabase.from("reviews").update({ rating: editRating, comment: cleanEdit }).eq("id", id);
    setEditingId(null);
    fetchMovies();
  };

  const deleteReview = async (id) => {
    if (!window.confirm("DELETE REVIEW RECORD?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchMovies();
  };

  const deleteMovie = async (movie) => {
    if (movie.reviews.length > 0 && !isAdmin) {
      alert("[ERR] CANNOT DELETE RECORD WITH ACTIVE REVIEWS.");
      return;
    }
    if (!window.confirm(`DELETE MOVIE: ${movie.title}?`)) return;

    await supabase.from("movies").delete().eq("id", movie.id);
    if (selectedId === movie.id) setSelectedId(null);
    fetchMovies();
  };

  const loginAdmin = () => {
    if (adminInput === ADMIN_KEY) {
      setIsAdmin(true); setShowAdminLogin(false); setAdminInput("");
    } else {
      alert("[ERR] UNAUTHORIZED CREDENTIALS");
    }
  };

  // --- RENDER ---
  return (
    <div className="movies-wrapper terminal-wrapper full-width-override">
      <div className="movies-grid">
        
        {/* LEFT COLUMN: MOVIE DIRECTORY */}
        <div className="widget amber-widget directory-column">
          <div className="widget-header amber-header flex-between">
            <span>DATABASE // MOVIE DIRECTORY</span>
            <button className="action-text-btn amber-text-btn" onClick={() => isAdmin ? setIsAdmin(false) : setShowAdminLogin(!showAdminLogin)}>
              {isAdmin ? "SYS.ADMIN(ACTIVE)" : "SYS.LOGIN"}
            </button>
          </div>

          {showAdminLogin && !isAdmin && (
            <div className="admin-login-box mb-3 amber-border">
              <span className="prompt-symbol alert-text">root@cine:~$</span>
              <input type="password" value={adminInput} onChange={e => setAdminInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && loginAdmin()} placeholder="Enter Passkey" className="terminal-input" />
              <button className="execute-btn alert-btn" onClick={loginAdmin}>AUTH</button>
            </div>
          )}

          <form onSubmit={addMovie} className="add-movie-form mb-4">
            <div className="terminal-prompt-container amber-border">
              <span className="prompt-symbol amber-text">{">"}</span>
              <input type="text" className="terminal-input" placeholder="Add new movie/series title..." value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
              <button type="submit" className="execute-btn amber-btn">ADD</button>
            </div>
          </form>

          <div className="directory-list custom-scrollbar">
            {loading ? <div className="terminal-log text-center mt-4">FETCHING RECORDS...</div> :
             movies.length === 0 ? <div className="terminal-log alert-text text-center mt-4">[NO RECORDS FOUND]</div> :
             movies.map(m => (
               <div 
                 key={m.id} 
                 className={`directory-item ${selectedId === m.id ? 'active' : ''}`}
                 onClick={() => setSelectedId(m.id)}
               >
                 <div className="movie-title">{m.title}</div>
                 <div className="movie-stats flex-between">
                   <span><span className="amber-text">★</span> {avgRating(m)} | REVIEWS: {m.reviews.length}</span>
                   {(isAdmin || m.created_by === userHash) && (
                     <button className="action-text-btn alert-text ml-2" onClick={(e) => { e.stopPropagation(); deleteMovie(m); }}>DEL</button>
                   )}
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* RIGHT COLUMN: REVIEWS & LOGS */}
        <div className="widget amber-widget logs-column">
          <div className="widget-header amber-header">SELECTED RECORD // REVIEWS & LOGS</div>
          
          {!selectedMovie ? (
            <div className="empty-state-logs">
              <span className="amber-text text-xl mb-2">{"<"} / {">"}</span>
              <div>[SELECT A RECORD FROM THE DIRECTORY TO VIEW LOGS]</div>
            </div>
          ) : (
            <div className="selected-movie-content custom-scrollbar">
              <div className="selected-movie-header">
                <h2>{selectedMovie.title}</h2>
                <div className="stat-row">
                  <span className="stat-val amber-text">★ {avgRating(selectedMovie)} AVERAGE RATING</span>
                  <span className="stat-key">{selectedMovie.reviews.length} TOTAL REVIEWS</span>
                </div>
              </div>

              {/* Add Review Form */}
              {!alreadyReviewed && (
                <div className="add-review-box mt-4">
                  <div className="stat-key mb-2">APPEND NEW REVIEW:</div>
                  <StarRating rating={rating} setRating={setRating} />
                  <textarea 
                    className="terminal-input review-textarea mt-2" 
                    placeholder="Enter your review log..." 
                    value={comment} 
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <div className="text-right mt-2">
                    <button className="execute-btn amber-btn" onClick={submitReview} disabled={!rating}>
                      SUBMIT LOG
                    </button>
                  </div>
                </div>
              )}

              {/* Review Feed */}
              <div className="review-feed mt-4">
                <div className="stat-key mb-3">DECRYPTED REVIEW LOGS:</div>
                {selectedMovie.reviews.length === 0 ? (
                  <div className="terminal-log text-center border-dashed p-3">[NO REVIEWS LOGGED FOR THIS RECORD]</div>
                ) : (
                  selectedMovie.reviews.map(r => {
                    const isOwner = r.user_hash === userHash;
                    const isEditing = editingId === r.id;

                    return (
                      <div key={r.id} className="review-card">
                        {isEditing ? (
                          <div className="edit-review-box">
                            <StarRating rating={editRating} setRating={setEditRating} />
                            <textarea 
                              className="terminal-input review-textarea mt-2" 
                              value={editComment} 
                              onChange={(e) => setEditComment(e.target.value)}
                            />
                            <div className="text-right mt-2 flex gap-2 justify-end">
                              <button className="action-text-btn" onClick={() => setEditingId(null)}>CANCEL</button>
                              <button className="execute-btn amber-btn" onClick={() => updateReview(r.id)}>SAVE PATCH</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="review-meta flex-between">
                              <StarRating rating={r.rating} readOnly={true} />
                              <span className="review-time">{new Date(r.created_at).toLocaleString()}</span>
                            </div>
                            <div className="review-comment mt-2">{r.comment}</div>
                            
                            {(isOwner || isAdmin) && (
                              <div className="review-actions mt-3">
                                {isOwner && <button className="action-text-btn amber-text-btn mr-3" onClick={() => { setEditingId(r.id); setEditRating(r.rating); setEditComment(r.comment); }}>EDIT LOG</button>}
                                <button className="action-text-btn alert-text" onClick={() => deleteReview(r.id)}>DEL LOG</button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MovieReviews;