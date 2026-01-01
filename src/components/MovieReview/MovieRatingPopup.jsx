import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Button,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Rating,
  Chip
} from "@mui/material";
import { supabase } from "../../supabaseClient";

const ADMIN_KEY = import.meta.env.VITE_ADMIN_PASSKEY;
const STORAGE_USER = "anon_user_hash";

/* ---------------- helpers ---------------- */
const getUserHash = () => {
  let hash = localStorage.getItem(STORAGE_USER);
  if (!hash) {
    hash = crypto.randomUUID();
    localStorage.setItem(STORAGE_USER, hash);
  }
  return hash;
};

const normalize = (t) =>
  t.toLowerCase().replace(/[^a-z0-9]/gi, "").trim();

/* ---- PROFANITY FILTER (same as ConfessionPopup) ---- */
const filterProfanity = (text) => {
  const badWords = [
    "porn", "sex", "boobs", "boob", "dick", "pussy", "mastrubation", "masturbation",
    "fuck", "shit", "bitch", "asshole", "bastard", "cunt", "whore", "slut",
    "rape", "damn", "cock", "suck", "nigger", "fag", "dyke", "retard", "piss", "gdtc", "godigital", "go digital"
  ];

  let cleaned = text;

  badWords
    .sort((a, b) => b.length - a.length)
    .forEach((word) => {
      // exact word
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      cleaned = cleaned.replace(regex, "***");

      // spaced letters: f u c k
      if (word.length > 3 && !word.includes(" ")) {
        const spaced = word.split("").join("\\s+");
        const spacedRegex = new RegExp(spaced, "gi");
        cleaned = cleaned.replace(spacedRegex, "***");
      }
    });

  return cleaned;
};

/* ---------------- component ---------------- */
const MovieRatingPopup = ({ open, onClose }) => {
  const userHash = getUserHash();

  const [movies, setMovies] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(false);

  // add movie
  const [newTitle, setNewTitle] = useState("");

  // review
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // edit review
  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");

  // admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminInput, setAdminInput] = useState("");

  /* ---------------- data ---------------- */
  useEffect(() => {
    if (open) fetchMovies();
    else {
      setSelectedId(null);
      setIsAdmin(false);
    }
  }, [open]);

  const fetchMovies = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("movies")
      .select(`
        id,
        title,
        created_by,
        created_at,
        reviews (
          id,
          rating,
          comment,
          user_hash,
          created_at
        )
      `)
      .order("created_at", { ascending: false });

    setMovies(data || []);
    setLoading(false);
  };

  /* ---------------- derived ---------------- */
  const selectedMovie = movies.find(m => m.id === selectedId) || null;

  const avgRating = (m) =>
    m.reviews.length
      ? (
          m.reviews.reduce((a, r) => a + r.rating, 0) /
          m.reviews.length
        ).toFixed(1)
      : "—";

  const alreadyReviewed =
    selectedMovie?.reviews.some(r => r.user_hash === userHash);

  /* ---------------- actions ---------------- */
  const addMovie = async () => {
    if (!newTitle.trim()) return;

    const cleanTitle = filterProfanity(newTitle.trim());

    if (
      movies.some(m => normalize(m.title) === normalize(cleanTitle))
    ) {
      alert("This movie already exists.");
      return;
    }

    await supabase.from("movies").insert([
      { title: cleanTitle, created_by: userHash }
    ]);

    setNewTitle("");
    fetchMovies();
  };

  const submitReview = async () => {
    if (!rating || !selectedMovie) return;

    const cleanComment = filterProfanity(comment);

    await supabase.from("reviews").insert([
      {
        movie_id: selectedMovie.id,
        rating,
        comment: cleanComment,
        user_hash: userHash
      }
    ]);

    setRating(0);
    setComment("");
    fetchMovies();
  };

  const updateReview = async (id) => {
    const cleanEdit = filterProfanity(editComment);

    await supabase
      .from("reviews")
      .update({ rating: editRating, comment: cleanEdit })
      .eq("id", id);

    setEditingId(null);
    fetchMovies();
  };

  const deleteReview = async (id) => {
    if (!window.confirm("Delete this review?")) return;
    await supabase.from("reviews").delete().eq("id", id);
    fetchMovies();
  };

  const deleteMovie = async (movie) => {
    if (movie.reviews.length > 0 && !isAdmin) {
      alert("Movies with reviews cannot be deleted.");
      return;
    }
    if (!window.confirm("Delete this movie?")) return;

    await supabase.from("movies").delete().eq("id", movie.id);
    setSelectedId(null);
    fetchMovies();
  };

  const loginAdmin = () => {
    if (adminInput === ADMIN_KEY) {
      setIsAdmin(true);
      setAdminInput("");
    } else {
      alert("Incorrect admin key");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        style: {
          background: "rgba(25,25,25,0.96)",
          color: "white",
          borderRadius: 16,
          border: "1px solid #3a3a3a"
        }
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box display="flex" gap={1} alignItems="center">
          🎬 Movie Board
          {isAdmin && <Chip size="small" label="Admin" color="warning" />}
        </Box>
        <IconButton onClick={onClose} sx={{ color: "#ccc" }}>✕</IconButton>
      </DialogTitle>

      <DialogContent>
        {!isAdmin && (
          <Box display="flex" gap={1} mb={2}>
            <TextField
              size="small"
              type="password"
              placeholder="Admin key"
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value)}
            />
            <Button onClick={loginAdmin}>Unlock</Button>
          </Box>
        )}

        {/* Add movie */}
        <Box display="flex" gap={1} mb={2}>
          <TextField
            fullWidth
            placeholder="Add a movie or series"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            sx={{ background: "rgba(255,255,255,0.08)", input: { color: "white" } }}
          />
          <Button
            variant="contained"
            sx={{ bgcolor: "#f78900", "&:hover": { bgcolor: "#d67600" } }}
            onClick={addMovie}
          >
            Add
          </Button>
        </Box>

        <Divider sx={{ mb: 2, bgcolor: "#444" }} />

        {loading ? (
          <CircularProgress sx={{ color: "#f78900" }} />
        ) : (
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(120px,1fr))"
            gap={1.5}
          >
            {movies.map(m => (
              <Box
                key={m.id}
                onClick={() => setSelectedId(m.id)}
                sx={{
                  aspectRatio: "1 / 1",
                  p: 1.2,
                  borderRadius: 2,
                  cursor: "pointer",
                  bgcolor: "rgba(255,255,255,0.05)",
                  border:
                    selectedId === m.id
                      ? "1px solid #f78900"
                      : "1px solid transparent",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {m.title}
                </Typography>

                <Typography variant="caption" color="#aaa">
                  ⭐ {avgRating(m)} · {m.reviews.length}
                </Typography>

                {(isAdmin || m.created_by === userHash) && (
                  <Button
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteMovie(m);
                    }}
                  >
                    Delete
                  </Button>
                )}
              </Box>
            ))}
          </Box>
        )}

        {/* Selected movie */}
        {selectedMovie && (
          <>
            <Divider sx={{ my: 2, bgcolor: "#444" }} />

            {!alreadyReviewed && (
              <>
                <Rating sx={{ bgcolor: "#44444469" }} value={rating} onChange={(_, v) => setRating(v)} />
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Write your review"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mt: 1, textarea: { color: "white" } }}
                />
                <Button
                  fullWidth
                  sx={{ mt: 1, bgcolor: "#f78900" }}
                  onClick={submitReview}
                >
                  Submit Review
                </Button>
              </>
            )}

            {selectedMovie.reviews.map(r => {
              const isOwner = r.user_hash === userHash;

              return (
                <Box
                  key={r.id}
                  sx={{
                    mt: 1,
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: "rgba(255,255,255,0.04)"
                  }}
                >
                  {editingId === r.id ? (
                    <>
                      <Rating
                        value={editRating}
                        onChange={(_, v) => setEditRating(v)}
                      />
                      <TextField
                        fullWidth
                        multiline
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      />
                      <Button onClick={() => updateReview(r.id)}>Save</Button>
                      <Button onClick={() => setEditingId(null)}>Cancel</Button>
                    </>
                  ) : (
                    <>
                      <Rating value={r.rating} readOnly size="small" />
                      <Typography>{r.comment}</Typography>
                      <Typography variant="caption" color="#666">
                        {new Date(r.created_at).toLocaleString()}
                      </Typography>

                      {(isOwner || isAdmin) && (
                        <Box>
                          {isOwner && (
                            <Button
                              size="small"
                              onClick={() => {
                                setEditingId(r.id);
                                setEditRating(r.rating);
                                setEditComment(r.comment);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            size="small"
                            color="error"
                            onClick={() => deleteReview(r.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              );
            })}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MovieRatingPopup;
