import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Upload,
  Download,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  Users,
  History,
  Search,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  Check,
  Image as ImageIcon,
  X,
  Eye,
  Edit2,
  ChevronDown,
  Cloud,
  RefreshCw,
  Settings,
  LogIn,
  LogOut,
  ShieldAlert,
  ExternalLink,
  Phone,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
} from "lucide-react";

// --- Embedded CSS Styles ---
const styles = `
:root {
  /* Color Palette (Light Default) */
  --color-primary: #1D1616;   /* Dark/Black Text */
  --color-brand: #8E1616;     /* Deep Red */
  --color-accent: #00610d;    /* Green */
  --color-bg: #EEEEEE;        /* Light Grey Background */
  --color-white: #ffffff;     /* Card Background */
  
  /* Transparency variations */
  --color-primary-fade: rgba(29, 22, 22, 0.1);
  --color-brand-fade: rgba(142, 22, 22, 0.1);
  --color-accent-fade: rgba(216, 64, 64, 0.1);
  --overlay-bg: rgba(29, 22, 22, 0.8);

  /* Spacing & Layout */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
  --font-sans: system-ui, -apple-system, sans-serif;
}

/* Dark Mode Overrides */
body.dark {
  --color-primary: #E0E0E0;   /* Light Text */
  --color-brand: #FF6B6B;     /* Brighter Red */
  --color-accent: #69F0AE;    /* Brighter Green */
  --color-bg: #121212;        /* Dark Background */
  --color-white: #1E1E1E;     /* Dark Card Background */
  
  --color-primary-fade: rgba(255, 255, 255, 0.1);
  --color-brand-fade: rgba(255, 107, 107, 0.15);
  --color-accent-fade: rgba(105, 240, 174, 0.15);
  --overlay-bg: rgba(0, 0, 0, 0.85);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background-color: var(--color-bg);
  color: var(--color-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* --- Layout Containers --- */
.app-container {
  min-height: 100vh;
  padding-bottom: 70px; /* Reduced from 80px */
}

.main-layout {
  max-width: 1280px;
  margin: 0 auto;
  padding: 12px; /* Compact padding for mobile */
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* --- Header --- */
.app-header {
  background-color: var(--color-white);
  border-bottom: 1px solid var(--color-primary-fade);
  position: sticky;
  top: 0;
  z-index: 30;
  padding: 0 16px;
  transition: background-color 0.3s ease;
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  height: 56px; /* Slightly shorter header */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  background-color: var(--color-brand);
  color: #fff; 
  padding: 6px;
  border-radius: var(--radius-sm);
  display: flex;
}

.brand-text {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-primary);
}

.brand-text span {
  color: var(--color-brand);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* --- Sidebar (Desktop) & Navigation --- */
.sidebar {
  display: none; /* Hidden on mobile by default */
  width: 250px;
  flex-shrink: 0;
}

.nav-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  font-weight: 700;
  text-transform: capitalize;
  border: none;
  background: transparent;
  color: var(--color-primary);
  opacity: 0.7;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  margin-bottom: 4px;
}

.nav-btn:hover {
  background-color: var(--color-white);
  opacity: 1;
}

.nav-btn.active {
  background-color: var(--color-primary);
  color: var(--color-bg); /* Inverted for contrast */
  opacity: 1;
  box-shadow: var(--shadow-md);
}

/* --- Bottom Navigation (Mobile) --- */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--color-white);
  border-top: 1px solid var(--color-primary-fade);
  display: flex;
  justify-content: space-around;
  padding: 8px;
  z-index: 40;
  padding-bottom: max(8px, env(safe-area-inset-bottom));
}

.bottom-nav-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
  border: none;
  color: var(--color-primary);
  opacity: 0.5;
  font-size: 10px;
  font-weight: 700;
  gap: 2px;
}

.bottom-nav-btn.active {
  color: var(--color-brand);
  opacity: 1;
}

/* --- Cards --- */
.card {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-primary-fade);
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.card-body {
  padding: 16px;
}

/* --- Dashboard Grid (Mobile Optimized) --- */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Force 3 columns on mobile */
  gap: 8px;
}

.stat-card {
  border-left: none; /* Remove left border on mobile to save space */
  border-top: 4px solid; /* Top border instead */
  text-align: center;
}
.stat-card.lent { border-color: var(--color-primary); }
.stat-card.borrowed { border-color: var(--color-accent); }
.stat-card.net { border-color: var(--color-brand); }

.stat-header {
  display: flex;
  flex-direction: column; /* Stack icon and label */
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-bottom: 4px;
}

.stat-icon {
  padding: 6px;
  border-radius: var(--radius-sm);
  display: flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
}
.stat-icon svg { width: 16px; height: 16px; }

.stat-icon.lent { background: var(--color-primary); color: var(--color-bg); }
.stat-icon.borrowed { background: var(--color-accent); color: #fff; }
.stat-icon.net { background: var(--color-brand); color: #fff; }

.stat-label {
  font-size: 0.65rem; /* Small label */
  font-weight: 700;
  color: var(--color-brand);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.stat-value {
  font-size: 1rem; /* Compact value */
  font-weight: 700;
  word-break: break-all;
}

.split-view {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 12px;
}

/* --- Transactions List --- */
.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: var(--color-white);
  padding: 10px;
  border-radius: var(--radius-md);
  margin-bottom: 12px;
  border: 1px solid var(--color-primary-fade);
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: var(--color-primary);
  background: transparent;
}

/* Table (Desktop) */
.desktop-table {
  width: 100%;
  border-collapse: collapse;
  display: none;
}

.desktop-table th {
  background-color: var(--color-bg);
  color: var(--color-primary);
  font-weight: 700;
  text-align: left;
  padding: 16px;
  border-bottom: 1px solid var(--color-primary-fade);
}

.desktop-table td {
  padding: 16px;
  border-bottom: 1px solid var(--color-bg);
}

.desktop-table tr:hover td {
  background-color: var(--color-bg);
}

/* Mobile List & Dashboard List */
.mobile-list, .dashboard-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.transaction-card {
  padding: 12px;
}

.trans-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.trans-name {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-primary);
}

.trans-date {
  font-size: 0.7rem;
  color: var(--color-brand);
  font-weight: 500;
}

.trans-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.trans-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px;
  border-radius: var(--radius-sm);
  border: none;
  background-color: var(--color-bg);
  cursor: pointer;
  display: flex;
}
.icon-btn.delete { color: var(--color-brand); }
.icon-btn.edit { color: var(--color-primary); }
.icon-btn.view { color: var(--color-accent); }

/* --- Badges --- */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}
.badge.lent { background-color: var(--color-primary); color: var(--color-bg); }
.badge.borrowed { background-color: var(--color-accent-fade); color: var(--color-accent); }

/* --- Typography Colors --- */
.text-primary { color: var(--color-primary); }
.text-brand { color: var(--color-brand); }
.text-accent { color: var(--color-accent); }

/* --- Buttons --- */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: var(--radius-sm);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
}

.btn-ghost {
  background: transparent;
  color: var(--color-primary);
}
.btn-ghost:hover { background-color: var(--color-bg); }

.btn-primary {
  background-color: var(--color-brand);
  color: #ffffff;
  box-shadow: var(--shadow-md);
}
.btn-primary:hover { opacity: 0.9; }

.btn-block {
  width: 100%;
  justify-content: center;
  padding: 14px;
  font-size: 1rem;
  border-radius: var(--radius-md);
}

/* --- Modal --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: var(--overlay-bg);
  backdrop-filter: blur(4px);
  z-index: 50;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Bottom sheet on mobile */
}

.modal-content {
  background-color: var(--color-white);
  width: 100%;
  max-width: 480px;
  max-height: 85vh; /* Leave some space at top */
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
}

.modal-header {
  padding: 16px;
  background-color: var(--color-primary);
  color: var(--color-bg);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* --- Forms --- */
.form-group {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border-radius: var(--radius-md);
  background-color: var(--color-bg);
  border: 2px solid transparent;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-primary);
  outline: none;
  transition: all 0.2s;
}

.form-input:focus {
  background-color: var(--color-white);
  border-color: var(--color-brand);
}

.toggle-group {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.toggle-btn {
  padding: 12px;
  border-radius: var(--radius-md);
  border: none;
  font-weight: 700;
  cursor: pointer;
  background-color: var(--color-bg);
  color: var(--color-primary);
  opacity: 0.6;
}

.toggle-btn.active-lent {
  background-color: var(--color-primary);
  color: var(--color-bg);
  opacity: 1;
}

.toggle-btn.active-borrowed {
  background-color: var(--color-accent);
  color: #fff;
  opacity: 1;
}

.file-drop {
  border: 2px dashed var(--color-primary-fade);
  border-radius: var(--radius-md);
  padding: 16px;
  text-align: center;
  cursor: pointer;
  position: relative;
}
.file-drop:hover { background-color: var(--color-bg); }

.autocomplete-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-white);
  border: 1px solid var(--color-bg);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 20;
  max-height: 200px;
  overflow-y: auto;
  margin-top: 4px;
  list-style: none;
}

.autocomplete-item {
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid var(--color-bg);
  color: var(--color-primary);
}
.autocomplete-item:hover { background-color: var(--color-bg); }

/* --- Tabs in Modal --- */
.tab-group {
  display: flex;
  border-bottom: 1px solid var(--color-primary-fade);
  margin-bottom: 16px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  font-weight: 700;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-primary);
  opacity: 0.4;
  cursor: pointer;
}

.tab-btn.active {
  opacity: 1;
  color: var(--color-brand);
  border-bottom-color: var(--color-brand);
}

/* --- Toast --- */
.toast {
  position: fixed;
  top: 16px;
  left: 16px;
  right: 16px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-md);
  z-index: 100;
  animation: fadeIn 0.3s;
}
.toast.success { background-color: var(--color-primary); color: var(--color-bg); }
.toast.error { background-color: var(--color-brand); }

/* --- Loading Spinner --- */
.spinner {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* --- Utilities --- */
.hidden-mobile { display: none; }
.hidden-desktop { display: block; }

/* --- Desktop Media Queries --- */
@media (min-width: 768px) {
  .app-container { padding-bottom: 0; }
  
  .main-layout {
    flex-direction: row;
    padding: 32px;
    gap: 2rem;
  }

  .header-content { height: 64px; }

  .sidebar { display: block; }
  .bottom-nav { display: none; }

  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .stat-card {
    border-left: 4px solid;
    border-top: none;
    text-align: left;
  }
  
  .stat-header {
    flex-direction: row;
    justify-content: flex-start;
    gap: 12px;
    margin-bottom: 8px;
  }
  
  .stat-icon { width: auto; height: auto; padding: 8px; }
  .stat-label { font-size: 0.875rem; }
  .stat-value { font-size: 1.5rem; }

  .split-view {
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .desktop-table { display: table; }
  .mobile-list { display: none; }

  .hidden-mobile { display: block; }
  .hidden-desktop { display: none; }

  .modal-overlay { align-items: center; }
  .modal-content {
    border-radius: var(--radius-lg);
    height: auto;
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
`;

// Update the useExternalScripts hook to handle WebView better
const useExternalScripts = () => {
  const [isXLSXLoaded, setIsXLSXLoaded] = useState(false);
  const [isGISLoaded, setIsGISLoaded] = useState(false);

  useEffect(() => {
    // Load SheetJS
    if (window.XLSX) setIsXLSXLoaded(true);
    else {
      const script = document.createElement("script");
      script.src =
        "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
      script.async = true;
      script.onload = () => setIsXLSXLoaded(true);
      script.onerror = () => {
        console.error("Failed to load XLSX");
        setIsXLSXLoaded(false);
      };
      document.body.appendChild(script);
    }

    // Load Google Identity Services with retry mechanism
    const loadGoogleScript = () => {
      if (window.google && window.google.accounts) {
        setIsGISLoaded(true);
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(
        'script[src*="accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        // Wait for it to load
        const checkGoogle = setInterval(() => {
          if (window.google && window.google.accounts) {
            setIsGISLoaded(true);
            clearInterval(checkGoogle);
          }
        }, 100);

        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkGoogle);
          if (!window.google || !window.google.accounts) {
            console.warn("Google script loaded but API not available");
            setIsGISLoaded(false);
          }
        }, 10000);
        return;
      }

      // Create new script if doesn't exist
      const script2 = document.createElement("script");
      script2.src = "https://accounts.google.com/gsi/client";
      script2.async = true;
      script2.defer = true;
      script2.onload = () => {
        // Double-check the API is available
        setTimeout(() => {
          if (window.google && window.google.accounts) {
            setIsGISLoaded(true);
          } else {
            console.warn("Script loaded but Google API not ready");
            setIsGISLoaded(false);
          }
        }, 500);
      };
      script2.onerror = () => {
        console.error("Failed to load Google Identity Services");
        setIsGISLoaded(false);
      };
      document.body.appendChild(script2);
    };

    loadGoogleScript();
  }, []);

  return { isXLSXLoaded, isGISLoaded };
};

// --- Image Compression Helper ---
const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const maxWidth = 600;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export default function App() {
  const { isXLSXLoaded, isGISLoaded } = useExternalScripts();

  // State
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [activeSyncModalTab, setActiveSyncModalTab] = useState("settings");
  const [viewImage, setViewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [personFilter, setPersonFilter] = useState(null); // For filtering by person

  // Theme State
  const [theme, setTheme] = useState(
    localStorage.getItem("app_theme") || "light"
  );

  // Sync State
  const [syncTab, setSyncTab] = useState("manual"); // 'manual' or 'google'
  const [googleSheetUrl, setGoogleSheetUrl] = useState("");
  const [googleClientId, setGoogleClientId] = useState("");
  const [googleToken, setGoogleToken] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // New State for Auto-Login
  const [autoSync, setAutoSync] = useState(false);

  // Autocomplete State
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const nameInputRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    name: "",
    mobile: "",
    amount: "",
    type: "lent",
    note: "",
    image: null,
  });
  const [isCompressing, setIsCompressing] = useState(false);

  // Theme Effect
  useEffect(() => {
    if (theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("ledger_data");
    const savedUrl = localStorage.getItem("ledger_sync_url");
    const savedClientId = localStorage.getItem("ledger_client_id");

    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local data");
      }
    }
    if (savedUrl) setGoogleSheetUrl(savedUrl);
    if (savedClientId) {
      setGoogleClientId(savedClientId);
      setSyncTab("google"); // Set UI tab
      setAutoSync(true); // Trigger auto login flag
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem("ledger_data", JSON.stringify(transactions));
    } catch (e) {
      showNotify("Storage full! Delete old items or images.", "error");
    }
  }, [transactions]);

  useEffect(() => {
    if (googleSheetUrl) localStorage.setItem("ledger_sync_url", googleSheetUrl);
    if (googleClientId)
      localStorage.setItem("ledger_client_id", googleClientId);
  }, [googleSheetUrl, googleClientId]);

  // Update Auto-Login Effect to check isGISLoaded properly
  useEffect(() => {
    if (
      autoSync &&
      isGISLoaded &&
      googleClientId &&
      window.google &&
      window.google.accounts
    ) {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: googleClientId,
          scope:
            "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
          callback: (response) => {
            if (response.access_token) {
              setGoogleToken(response.access_token);
              showNotify("Auto-logged in! Pulling data...");
              syncWithGoogleAPI("pull", response.access_token);
            } else {
              showNotify("Auto-login failed.", "error");
            }
            setAutoSync(false);
          },
          error_callback: (error) => {
            console.error("Auto-login error:", error);
            showNotify("Auto-login failed. Please login manually.", "error");
            setAutoSync(false);
          },
        });
        client.requestAccessToken();
      } catch (err) {
        console.error("Auto login error:", err);
        showNotify("Auto-login failed. Please login manually.", "error");
        setAutoSync(false);
      }
    } else if (autoSync && !isGISLoaded) {
      // Wait a bit longer for script to load
      const timer = setTimeout(() => {
        if (isGISLoaded) {
          // Retry
        } else {
          showNotify(
            "Google services not available. Please login manually.",
            "error"
          );
          setAutoSync(false);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoSync, isGISLoaded, googleClientId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        nameInputRef.current &&
        !nameInputRef.current.contains(event.target)
      ) {
        setShowNameSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Logic Helpers ---

  const showNotify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Update handleGoogleLogin to better handle loading state
  const handleGoogleLogin = () => {
    if (!googleClientId) {
      showNotify("Please enter a Client ID first.", "error");
      return;
    }

    if (!isGISLoaded) {
      showNotify(
        "Google services not loaded yet. Please wait and try again.",
        "error"
      );
      return;
    }

    if (!window.google || !window.google.accounts) {
      showNotify(
        "Google Script not loaded. Check internet or try reloading the app.",
        "error"
      );
      return;
    }

    setIsLoggingIn(true);

    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId.trim(),
        scope:
          "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
        callback: (response) => {
          if (response.access_token) {
            setGoogleToken(response.access_token);
            showNotify("Logged in with Google!");
          } else {
            showNotify("Login failed or cancelled.", "error");
          }
          setIsLoggingIn(false);
        },
        error_callback: (error) => {
          console.error("Google Login Error:", error);
          showNotify("Login error. Please try again.", "error");
          setIsLoggingIn(false);
        },
      });
      client.requestAccessToken();
    } catch (err) {
      console.error(err);
      showNotify("Google Login Error. Check Client ID.", "error");
      setIsLoggingIn(false);
    }
  };
  // --- Helper: Upload Base64 to Google Drive ---
  const uploadFileToDrive = async (base64Data, filename) => {
    if (!googleToken) throw new Error("No Google Token");

    const matches = base64Data.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return null;

    const contentType = matches[1];
    const data = matches[2];

    const metadata = {
      name: filename,
      mimeType: contentType,
    };

    const boundary = "-------314159265358979323846";
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    const requestBody =
      delimiter +
      "Content-Type: application/json\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: " +
      contentType +
      "\r\n" +
      "Content-Transfer-Encoding: base64\r\n\r\n" +
      data +
      close_delim;

    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${googleToken}`,
          "Content-Type": 'multipart/related; boundary="' + boundary + '"',
        },
        body: requestBody,
      }
    );

    const fileData = await response.json();
    if (fileData.error) throw new Error(fileData.error.message);

    const fieldsRes = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileData.id}?fields=webViewLink`,
      {
        headers: { Authorization: `Bearer ${googleToken}` },
      }
    );
    const fieldsData = await fieldsRes.json();

    return fieldsData.webViewLink;
  };

  // --- Sync Logic Router ---
  const handleSync = async (direction) => {
    if (syncTab === "manual") {
      await syncWithAppsScript(direction);
    } else {
      await syncWithGoogleAPI(direction);
    }
  };

  // 1. Manual Apps Script Method
  const syncWithAppsScript = async (direction) => {
    if (!googleSheetUrl) {
      showNotify("Please enter Google Apps Script URL first", "error");
      return;
    }

    setIsSyncing(true);
    try {
      if (direction === "push") {
        const hasImages = transactions.some(
          (t) => t.image && t.image.startsWith("data:")
        );
        if (hasImages) {
          showNotify(
            "Note: Images are NOT synced in Manual mode. Use Google Login mode.",
            "error"
          );
        }

        const payload = transactions.map(({ image, ...rest }) => rest);
        await fetch(googleSheetUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        showNotify("Data pushed to Sheet (Images skipped)");
      } else {
        const response = await fetch(googleSheetUrl);
        const data = await response.json();
        mergeData(data);
        showNotify("Data pulled from Sheet successfully");
      }
    } catch (error) {
      console.error(error);
      showNotify("Sync failed. Check URL or Internet.", "error");
    } finally {
      setIsSyncing(false);
    }
  };

  // 2. Direct Google API Method
  const syncWithGoogleAPI = async (direction, tokenOverride = null) => {
    const token = tokenOverride || googleToken;
    if (!token) {
      showNotify("Please sign in first", "error");
      return;
    }

    setIsSyncing(true);

    try {
      // Step A: Find Spreadsheet
      const searchUrl =
        "https://www.googleapis.com/drive/v3/files?q=name='LedgerLink_DB' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false";
      const searchRes = await fetch(searchUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const searchData = await searchRes.json();

      let spreadsheetId;

      if (searchData.files && searchData.files.length > 0) {
        spreadsheetId = searchData.files[0].id;
      } else {
        if (direction === "pull") {
          showNotify('No "LedgerLink_DB" sheet found.', "error");
          setIsSyncing(false);
          return;
        }
        // Create if not found (only needed for push/initial setup)
        const createRes = await fetch(
          "https://sheets.googleapis.com/v4/spreadsheets",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ properties: { title: "LedgerLink_DB" } }),
          }
        );
        const createData = await createRes.json();
        spreadsheetId = createData.spreadsheetId;
      }

      const range = "Sheet1!A1:Z";

      if (direction === "push") {
        // *** IMAGE UPLOAD LOGIC START ***
        let updatedTransactions = [...transactions];
        let uploadsCount = 0;

        for (let i = 0; i < updatedTransactions.length; i++) {
          const t = updatedTransactions[i];
          if (t.image && t.image.startsWith("data:")) {
            showNotify(`Uploading image for ${t.name}...`);
            try {
              const driveLink = await uploadFileToDrive(
                t.image,
                `Receipt_${t.name}_${t.date}.jpg`
              );
              if (driveLink) {
                updatedTransactions[i] = { ...t, image: driveLink };
                uploadsCount++;
              }
            } catch (uploadErr) {
              console.error("Failed to upload image", uploadErr);
              showNotify("Failed to upload one or more images", "error");
            }
          }
        }

        if (uploadsCount > 0) {
          setTransactions(updatedTransactions);
          localStorage.setItem(
            "ledger_data",
            JSON.stringify(updatedTransactions)
          );
          showNotify(`${uploadsCount} images uploaded to Drive!`);
        }
        // *** IMAGE UPLOAD LOGIC END ***

        // Prepare Data for Sheet
        const headers = [
          "id",
          "date",
          "name",
          "mobile",
          "amount",
          "type",
          "note",
          "image",
        ];
        const rows = updatedTransactions.map((t) =>
          headers.map((h) => t[h] || "")
        );
        const values = [headers, ...rows];

        // Clear Sheet First
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}:clear`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // Write Data
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ values }),
          }
        );

        showNotify('Synced with "LedgerLink_DB" successfully!');
      } else {
        // Pull Data
        const getRes = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const getData = await getRes.json();

        if (!getData.values || getData.values.length < 2) {
          showNotify("Sheet is empty.", "error");
          setIsSyncing(false);
          return;
        }

        const headers = getData.values[0];
        const rawRows = getData.values.slice(1);

        const mergedData = rawRows.map((row) => {
          const obj = {};
          headers.forEach((h, i) => {
            obj[h] = row[i];
          });
          return obj;
        });

        mergeData(mergedData);
        showNotify("Synced from Google Sheet!");
      }
    } catch (err) {
      console.error(err);
      showNotify("Google Sync Error. Token might be expired.", "error");
      if (!tokenOverride) setGoogleToken(null);
    } finally {
      setIsSyncing(false);
    }
  };

  const mergeData = (newData) => {
    const processed = newData.map((row) => ({
      id: parseFloat(row.id) || Date.now() + Math.random(),
      date: row.date || new Date().toISOString().split("T")[0],
      name: row.name || "Unknown",
      mobile: row.mobile || "",
      amount: parseFloat(row.amount) || 0,
      type: (row.type || "lent").toLowerCase(),
      note: row.note || "",
      image: row.image || null,
    }));
    setTransactions(processed);
  };

  const handleFileUpload = (e) => {
    if (!isXLSXLoaded) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = window.XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = window.XLSX.utils.sheet_to_json(ws);

        const normalizedData = data.map((row) => ({
          id: row.id || row.ID || Date.now() + Math.random(),
          date: row.date || row.Date || new Date().toISOString().split("T")[0],
          name: row.name || row.Name || "Unknown",
          mobile: row.mobile || row.Mobile || "",
          amount: parseFloat(row.amount || row.Amount || 0),
          type: (row.type || row.Type || "lent").toLowerCase(),
          note: row.note || row.Note || "",
          image: null,
        }));

        setTransactions([...normalizedData, ...transactions]);
        showNotify(
          `${normalizedData.length} records imported! (Images cannot be imported)`
        );
      } catch (err) {
        showNotify("Error reading Excel file.", "error");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (!isXLSXLoaded) return;
    try {
      const ws = window.XLSX.utils.json_to_sheet(
        transactions.map((t) => ({
          ID: t.id,
          Date: t.date,
          Name: t.name,
          Mobile: t.mobile || "",
          Type: t.type,
          Amount: t.amount,
          Note: t.note,
          HasReceipt: t.image ? "Yes" : "No",
        }))
      );
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "Ledger");
      window.XLSX.writeFile(
        wb,
        `Ledger_Export_${new Date().toISOString().split("T")[0]}.xlsx`
      );
      showNotify("Excel file exported!");
    } catch (err) {
      showNotify("Export failed.", "error");
    }
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressedBase64 = await compressImage(file);
      setFormData((prev) => ({ ...prev, image: compressedBase64 }));
    } catch (err) {
      showNotify("Failed to process image", "error");
    } finally {
      setIsCompressing(false);
    }
  };

  const handleSaveTransaction = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    const amountVal = parseFloat(formData.amount);

    if (editingId) {
      setTransactions(
        transactions.map((t) =>
          t.id === editingId ? { ...t, ...formData, amount: amountVal } : t
        )
      );
      showNotify("Transaction updated successfully");
    } else {
      const newTrans = {
        id: Date.now(),
        ...formData,
        amount: amountVal,
      };
      setTransactions([newTrans, ...transactions]);
      showNotify("Transaction added");
    }

    closeModal();
  };

  const openEditModal = (transaction) => {
    setFormData({
      date: transaction.date,
      name: transaction.name,
      mobile: transaction.mobile || "",
      amount: transaction.amount,
      type: transaction.type,
      note: transaction.note,
      image: transaction.image,
    });
    setEditingId(transaction.id);
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      name: "",
      mobile: "",
      amount: "",
      type: "lent",
      note: "",
      image: null,
    });
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
    showNotify("Transaction deleted");
  };

  const sendWhatsAppReport = (personName, personMobile) => {
    if (!personMobile) {
      showNotify("No mobile number found for this person", "error");
      return;
    }

    // Get all transactions for this person
    const personTransactions = transactions
      .filter((t) => t.name.trim() === personName)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (personTransactions.length === 0) {
      showNotify("No transactions found", "error");
      return;
    }

    // Calculate totals
    let totalLent = 0;
    let totalReturned = 0;
    personTransactions.forEach((t) => {
      if (t.type === "lent") totalLent += t.amount;
      else totalReturned += t.amount;
    });
    const balance = totalLent - totalReturned;

    // Format detailed report
    let message = `📊 *Transaction Report for ${personName}*\n\n`;
    message += `📅 *Period:* ${personTransactions[0].date} to ${
      personTransactions[personTransactions.length - 1].date
    }\n\n`;
    message += `💰 *Summary:*\n`;
    message += `   • Total Lent: ₹${totalLent.toLocaleString()}\n`;
    message += `   • Total Recovered: ₹${totalReturned.toLocaleString()}\n`;
    message += `   • Balance: ${
      balance >= 0 ? "+" : ""
    }₹${balance.toLocaleString()}\n\n`;
    message += `📋 *Transaction Details:*\n\n`;

    personTransactions.forEach((t, idx) => {
      message += `${idx + 1}. *${t.date}*\n`;
      message += `   Type: ${t.type === "lent" ? "📤 Lent" : "📥 Recovered"}\n`;
      message += `   Amount: ₹${t.amount.toLocaleString()}\n`;
      if (t.note) message += `   Note: ${t.note}\n`;
      message += `\n`;
    });

    message += `\n---\n_Generated from LedgerLink_`;

    const cleanMobile = personMobile.replace(/[^0-9+]/g, "");

    const whatsappUrl = `https://wa.me/${cleanMobile}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    showNotify("Opening WhatsApp...");
  };

  const stats = useMemo(() => {
    let totalLent = 0;
    let totalBorrowed = 0;
    transactions.forEach((t) => {
      if (t.type === "lent") totalLent += t.amount;
      else totalBorrowed += t.amount;
    });
    return {
      lent: totalLent,
      borrowed: totalBorrowed,
      net: totalLent - totalBorrowed,
    };
  }, [transactions]);

  const peopleSummary = useMemo(() => {
    const people = {};
    transactions.forEach((t) => {
      const name = t.name.trim();
      if (!people[name]) {
        people[name] = { balance: 0, mobile: t.mobile || "" };
      }
      if (t.type === "lent") people[name].balance += t.amount;
      else people[name].balance -= t.amount;
      if (t.mobile && !people[name].mobile) {
        people[name].mobile = t.mobile;
      }
    });
    return Object.entries(people)
      .map(([name, data]) => ({
        name,
        balance: data.balance,
        mobile: data.mobile,
      }))
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
  }, [transactions]);

  const uniqueNames = useMemo(() => {
    const names = new Set(transactions.map((t) => t.name.trim()));
    return [...names].sort();
  }, [transactions]);

  const suggestedNames = useMemo(() => {
    if (!formData.name) return uniqueNames;
    return uniqueNames.filter((n) =>
      n.toLowerCase().includes(formData.name.toLowerCase())
    );
  }, [uniqueNames, formData.name]);

  const filteredTransactions = transactions
    .filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.note.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPerson = !personFilter || t.name.trim() === personFilter;
      return matchesSearch && matchesPerson;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // --- Render Parts ---

  const DashboardView = () => (
    <div className="dashboard-container">
      {/* Stats Cards (Compacted for Mobile) */}
      <div className="stats-grid">
        <div className="card stat-card lent">
          <div className="card-body">
            <div className="stat-header">
              <div className="stat-icon lent">
                <ArrowUpRight />
              </div>
              <span className="stat-label">Spent</span>
            </div>
            <div className="stat-value text-primary">
              ₹
              {stats.lent.toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>

        <div className="card stat-card borrowed">
          <div className="card-body">
            <div className="stat-header">
              <div className="stat-icon borrowed">
                <ArrowDownLeft />
              </div>
              <span className="stat-label">Debt/Rec</span>
            </div>
            <div className="stat-value text-accent">
              ₹
              {stats.borrowed.toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>

        <div className="card stat-card net">
          <div className="card-body">
            <div className="stat-header">
              <div className="stat-icon net">
                <Wallet />
              </div>
              <span className="stat-label">Lent</span>
            </div>
            <div
              className={`stat-value ${
                stats.net >= 0 ? "text-brand" : "text-accent"
              }`}
            >
              {stats.net >= 0 ? "-" : ""}₹
              {stats.net.toLocaleString(undefined, {
                minimumFractionDigits: 0,
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="split-view">
        {/* Top People */}
        <div className="card">
          <div className="card-body">
            <h3
              className="text-primary"
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              <Users size={18} /> Top People
            </h3>
            <div className="dashboard-list">
              {peopleSummary.slice(0, 5).map((p, idx) => (
                <div
                  key={idx}
                  className="transaction-card"
                  style={{ background: "var(--color-bg)", borderRadius: "8px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        className="stat-icon"
                        style={{
                          background:
                            p.balance >= 0
                              ? "var(--color-primary)"
                              : "var(--color-accent)",
                          color: "var(--color-bg)",
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          fontSize: "10px",
                          fontWeight: "bold",
                        }}
                      >
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <span
                        className="text-primary"
                        style={{ fontWeight: "600", fontSize: "0.9rem" }}
                      >
                        {p.name}
                      </span>
                    </div>
                    <span
                      style={{ fontWeight: "700", fontSize: "0.9rem" }}
                      className={
                        p.balance >= 0 ? "text-primary" : "text-accent"
                      }
                    >
                      {p.balance >= 0 ? "Owes " : "You owe "} ₹
                      {Math.abs(p.balance).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
              {peopleSummary.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "var(--color-brand-fade)",
                    fontSize: "0.9rem",
                  }}
                >
                  No data yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-body">
            <h3
              className="text-primary"
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              <History size={18} /> Recent
            </h3>
            <div className="dashboard-list">
              {transactions
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5)
                .map((t) => (
                  <div
                    key={t.id}
                    style={{
                      borderBottom: "1px solid var(--color-bg)",
                      paddingBottom: "8px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                        }}
                      >
                        <div>
                          <div
                            className="text-primary"
                            style={{
                              fontWeight: "600",
                              fontSize: "0.95rem",
                              display: "flex",
                              alignItems: "center",
                              gap: "6px",
                            }}
                          >
                            {t.name}
                            {t.image && (
                              <ImageIcon size={12} className="text-brand" />
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--color-brand)",
                            }}
                          >
                            {t.date}
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          className={
                            t.type === "lent" ? "text-primary" : "text-accent"
                          }
                          style={{ fontWeight: "700", fontSize: "1rem" }}
                        >
                          {t.type === "lent" ? "+" : "-"}₹
                          {t.amount.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              {transactions.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    color: "var(--color-brand-fade)",
                    fontSize: "0.9rem",
                  }}
                >
                  No transactions yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      {/* CSS Injection */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />

      {/* Toast */}
      {notification && (
        <div
          className={`toast ${
            notification.type === "error" ? "error" : "success"
          }`}
        >
          {notification.type === "error" ? (
            <AlertCircle size={18} />
          ) : (
            <Check size={18} />
          )}
          {notification.msg}
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand-logo">
            <div className="logo-icon">
              <FileSpreadsheet size={20} />
            </div>
            <h1 className="brand-text">
              Ledger<span>Link</span>
            </h1>
          </div>
          <div className="header-actions">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button
              onClick={() => setShowSyncModal(true)}
              className="btn btn-ghost"
              title="Cloud Sync"
            >
              <Cloud
                size={20}
                className={
                  googleSheetUrl || googleToken ? "text-brand" : "text-primary"
                }
              />
            </button>

            <div
              className="hidden-mobile"
              style={{ position: "relative", display: "inline-block" }}
            >
              <button
                className="btn btn-ghost"
                title="Import Excel"
                style={{ position: "relative" }}
              >
                <Upload size={20} />
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: 0,
                    cursor: "pointer",
                  }}
                />
              </button>
            </div>

            {/* Mobile Export Button (Always Visible) */}
            <button
              onClick={handleExport}
              className="btn btn-ghost"
              title="Export Excel"
            >
              <Download size={20} />
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary"
            >
              <Plus size={18} />
              <span className="hidden-mobile">Add</span>
            </button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        {/* Desktop Sidebar */}
        <nav className="sidebar">
          {["dashboard", "transactions", "people"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`nav-btn ${activeTab === tab ? "active" : ""}`}
            >
              {tab === "dashboard" && <Wallet size={20} />}
              {tab === "transactions" && <History size={20} />}
              {tab === "people" && <Users size={20} />}
              {tab}
            </button>
          ))}

          <div
            style={{
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(29,22,22,0.1)",
            }}
          >
            <button className="nav-btn" style={{ position: "relative" }}>
              <Upload size={20} /> Import Excel
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
            </button>
            <button onClick={handleExport} className="nav-btn">
              <Download size={20} /> Export Excel
            </button>
            <button onClick={() => setShowSyncModal(true)} className="nav-btn">
              <Settings size={20} /> Sync Settings
            </button>
          </div>
        </nav>

        <main style={{ flex: 1 }}>
          {activeTab === "dashboard" && <DashboardView />}

          {activeTab === "transactions" && (
            <div>
              {personFilter && (
                <div
                  style={{
                    marginBottom: "16px",
                    padding: "10px",
                    background: "var(--color-brand-fade)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Users size={16} className="text-brand" />
                    <span
                      className="text-primary"
                      style={{ fontWeight: "500", fontSize: "0.9rem" }}
                    >
                      Filter: <strong>{personFilter}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setPersonFilter(null);
                      showNotify("Filter cleared");
                    }}
                    className="btn btn-ghost"
                    style={{ padding: "4px 8px", fontSize: "0.8rem" }}
                  >
                    <X size={14} /> Clear
                  </button>
                </div>
              )}
              <div className="search-bar">
                <Search size={18} className="text-brand" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              {/* Desktop Table View */}
              <div className="card hidden-mobile">
                <table className="desktop-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Person</th>
                      <th>Type</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                      <th>Note</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t) => (
                      <tr key={t.id}>
                        <td>{t.date}</td>
                        <td
                          className="text-primary"
                          style={{ fontWeight: "bold" }}
                        >
                          {t.name}
                        </td>
                        <td>
                          <span className={`badge ${t.type}`}>
                            {t.type === "lent" ? "Lented" : "Recovered"}
                          </span>
                        </td>
                        <td
                          className={
                            t.type === "lent" ? "text-primary" : "text-accent"
                          }
                          style={{ textAlign: "right", fontWeight: "bold" }}
                        >
                          ₹{t.amount.toLocaleString()}
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            <span
                              style={{
                                maxWidth: "150px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {t.note}
                            </span>
                            {t.image && (
                              <button
                                onClick={() => setViewImage(t.image)}
                                className="icon-btn view"
                                title="View Receipt"
                              >
                                <Eye size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              gap: "8px",
                            }}
                          >
                            <button
                              onClick={() => openEditModal(t)}
                              className="icon-btn edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => deleteTransaction(t.id)}
                              className="icon-btn delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (Compacted) */}
              <div className="mobile-list hidden-desktop">
                {filteredTransactions.map((t) => (
                  <div key={t.id} className="card transaction-card">
                    <div className="trans-header">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <h4 className="trans-name">{t.name}</h4>
                        {t.image && (
                          <ImageIcon size={14} className="text-brand" />
                        )}
                      </div>
                      <span className={`badge ${t.type}`}>
                        {t.type === "lent" ? "Lent" : "Rec"}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p className="trans-date">{t.date}</p>
                      <div
                        className={
                          t.type === "lent" ? "text-primary" : "text-accent"
                        }
                        style={{ fontSize: "1.1rem", fontWeight: "700" }}
                      >
                        ₹{t.amount.toLocaleString()}
                      </div>
                    </div>
                    <div className="trans-footer">
                      <div className="trans-actions">
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="icon-btn delete"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(t)}
                          className="icon-btn edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        {t.image && (
                          <button
                            onClick={() => setViewImage(t.image)}
                            className="icon-btn view"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                      </div>
                      {t.note && (
                        <p
                          style={{
                            fontSize: "0.75rem",
                            color: "var(--color-primary)",
                            opacity: 0.7,
                            maxWidth: "150px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {t.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "people" && (
            <div className="stats-grid">
              {peopleSummary.map((person, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    textAlign: "center",
                    padding: "16px",
                    borderTop: "4px solid var(--color-brand)",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setPersonFilter(person.name);
                    setActiveTab("transactions");
                    showNotify(`Filter: ${person.name}`);
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background:
                        person.balance >= 0
                          ? "var(--color-primary)"
                          : "var(--color-accent)",
                      color: "var(--color-bg)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      margin: "0 auto 8px auto",
                    }}
                  >
                    {person.name.charAt(0).toUpperCase()}
                  </div>
                  <h3
                    className="text-primary"
                    style={{ fontSize: "0.9rem", fontWeight: "bold" }}
                  >
                    {person.name}
                  </h3>
                  <p
                    className="text-brand"
                    style={{ fontSize: "0.65rem", margin: "2px 0 4px 0" }}
                  >
                    Net Balance
                  </p>
                  <div
                    className={
                      person.balance >= 0 ? "text-primary" : "text-accent"
                    }
                    style={{ fontSize: "1rem", fontWeight: "bold" }}
                  >
                    {person.balance >= 0 ? "+" : ""}₹
                    {person.balance.toLocaleString()}
                  </div>
                  {person.mobile && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        sendWhatsAppReport(person.name, person.mobile);
                      }}
                      className="btn btn-primary"
                      style={{
                        marginTop: "8px",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        fontSize: "0.75rem",
                        padding: "6px",
                      }}
                    >
                      <MessageSquare size={12} /> Report
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="bottom-nav">
        {["dashboard", "transactions", "people"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`bottom-nav-btn ${activeTab === tab ? "active" : ""}`}
          >
            {tab === "dashboard" && <Wallet size={22} />}
            {tab === "transactions" && <History size={22} />}
            {tab === "people" && <Users size={22} />}
            <span style={{ fontSize: "0.65rem", textTransform: "uppercase" }}>
              {tab}
            </span>
          </button>
        ))}
      </div>

      {/* Sync Modal */}
      {showSyncModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                Cloud Sync
              </h3>
              <button
                onClick={() => setShowSyncModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-bg)",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="tab-group">
                <button
                  className={`tab-btn ${
                    activeSyncModalTab === "settings" ? "active" : ""
                  }`}
                  onClick={() => setActiveSyncModalTab("settings")}
                >
                  Settings
                </button>
                <button
                  className={`tab-btn ${
                    activeSyncModalTab === "help" ? "active" : ""
                  }`}
                  onClick={() => setActiveSyncModalTab("help")}
                >
                  Help
                </button>
              </div>
              // Add loading indicator in the sync modal
              {activeSyncModalTab === "settings" ? (
                <>
                  <div className="form-group">
                    <label className="form-label">Client ID</label>
                    <input
                      type="text"
                      placeholder="12345...apps.googleusercontent.com"
                      value={googleClientId}
                      onChange={(e) => setGoogleClientId(e.target.value.trim())}
                      className="form-input"
                    />
                    <p
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--color-primary)",
                        opacity: 0.6,
                        marginTop: "4px",
                      }}
                    >
                      From Google Cloud Console.
                    </p>
                  </div>

                  {googleClientId && !isGISLoaded && (
                    <div
                      style={{
                        background: "#fff3cd",
                        color: "#856404",
                        padding: "8px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <RefreshCw className="spinner" size={14} /> Loading Google
                      Services...
                    </div>
                  )}

                  <button
                    onClick={handleGoogleLogin}
                    className="btn btn-block"
                    style={{
                      background: "white",
                      color: "#4285F4",
                      border: "1px solid #dadce0",
                      justifyContent: "center",
                      marginTop: "12px",
                    }}
                    disabled={isLoggingIn || !googleClientId || !isGISLoaded}
                  >
                    {isLoggingIn ? (
                      <RefreshCw className="spinner" size={20} />
                    ) : (
                      <LogIn size={20} />
                    )}
                    {googleToken
                      ? "Connected"
                      : !googleClientId
                      ? "Enter Client ID First"
                      : isGISLoaded
                      ? "Sign in with Google"
                      : "Loading..."}
                  </button>

                  {googleToken && (
                    <div
                      style={{
                        background: "#e6f4ea",
                        color: "#1e8e3e",
                        padding: "8px",
                        borderRadius: "8px",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginTop: "8px",
                      }}
                    >
                      <Check size={14} /> Session Active
                    </div>
                  )}

                  <div className="toggle-group" style={{ marginTop: "16px" }}>
                    <button
                      onClick={() => handleSync("pull")}
                      className="btn btn-block"
                      style={{
                        background: "var(--color-bg)",
                        color: "var(--color-primary)",
                        flexDirection: "column",
                        height: "80px",
                        gap: "4px",
                        fontSize: "0.9rem",
                      }}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <RefreshCw className="spinner" />
                      ) : (
                        <ArrowDownLeft size={24} />
                      )}
                      PULL
                    </button>
                    <button
                      onClick={() => handleSync("push")}
                      className="btn btn-block"
                      style={{
                        background: "var(--color-brand)",
                        color: "white",
                        flexDirection: "column",
                        height: "80px",
                        gap: "4px",
                        fontSize: "0.9rem",
                      }}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <RefreshCw className="spinner" />
                      ) : (
                        <ArrowUpRight size={24} />
                      )}
                      PUSH
                    </button>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: "1.5",
                    color: "var(--color-primary)",
                  }}
                >
                  <h4
                    style={{
                      fontWeight: "bold",
                      marginBottom: "8px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <HelpCircle size={16} /> Setup Guide
                  </h4>
                  <ol
                    style={{
                      paddingLeft: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.cloud.google.com/"
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          color: "var(--color-brand)",
                          fontWeight: "bold",
                        }}
                      >
                        Google Cloud Console
                      </a>
                      .
                    </li>
                    <li>{"Create Project -> Enable Sheets & Drive API."}</li>
                    <li>{"OAuth Consent Screen -> Add Test Users."}</li>
                    <li>
                      {"Credentials -> Create OAuth Client ID (Web App)."}
                    </li>
                    <li>
                      Add Authorized Origin:
                      <div
                        style={{
                          background: "var(--color-bg)",
                          padding: "6px",
                          borderRadius: "4px",
                          marginTop: "4px",
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          wordBreak: "break-all",
                        }}
                      >
                        {window.location.origin}
                      </div>
                    </li>
                    <li>Copy Client ID to Settings tab.</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Transaction Modal (Add/Edit) */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                {editingId ? "Edit" : "New Transaction"}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-bg)",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="modal-body">
              <div
                className="form-group"
                style={{ position: "relative" }}
                ref={nameInputRef}
              >
                <label className="form-label">Who?</label>
                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    required
                    placeholder="Name..."
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      setShowNameSuggestions(true);
                    }}
                    onFocus={() => setShowNameSuggestions(true)}
                    className="form-input"
                    style={{ paddingRight: "40px" }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--color-primary)",
                      opacity: 0.4,
                      pointerEvents: "none",
                    }}
                  >
                    <ChevronDown size={20} />
                  </div>
                </div>

                {showNameSuggestions && (
                  <ul className="autocomplete-list">
                    {suggestedNames.map((name) => {
                      const personTransaction = transactions.find(
                        (t) => t.name.trim() === name && t.mobile
                      );
                      const mobile = personTransaction?.mobile || "";

                      return (
                        <li
                          key={name}
                          onMouseDown={() => {
                            setFormData({
                              ...formData,
                              name: name,
                              mobile: mobile,
                            });
                            setShowNameSuggestions(false);
                          }}
                          className="autocomplete-item"
                        >
                          <div
                            style={{
                              width: "24px",
                              height: "24px",
                              borderRadius: "50%",
                              background: "var(--color-primary)",
                              color: "var(--color-bg)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                          >
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div
                            style={{ display: "flex", flexDirection: "column" }}
                          >
                            <span>{name}</span>
                            {mobile && (
                              <span
                                style={{
                                  fontSize: "0.7rem",
                                  color: "var(--color-brand)",
                                }}
                              >
                                {mobile}
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Mobile (Optional)</label>
                <input
                  type="tel"
                  placeholder="+91..."
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="toggle-group">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "lent" })}
                  className={`toggle-btn ${
                    formData.type === "lent" ? "active-lent" : ""
                  }`}
                >
                  Lent (In)
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: "borrowed" })}
                  className={`toggle-btn ${
                    formData.type === "borrowed" ? "active-borrowed" : ""
                  }`}
                >
                  Borrowed (Out)
                </button>
              </div>

              <div className="toggle-group">
                <div>
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Receipt</label>
                <div className="file-drop">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    style={{
                      position: "absolute",
                      inset: 0,
                      opacity: 0,
                      cursor: "pointer",
                    }}
                  />
                  {formData.image ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "var(--color-primary)",
                      }}
                    >
                      <Check size={16} />
                      <span style={{ fontWeight: "bold" }}>Attached</span>
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        color: "var(--color-primary)",
                        opacity: 0.4,
                      }}
                    >
                      <ImageIcon size={20} />
                      <span style={{ fontSize: "0.8rem" }}>Upload</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Note</label>
                <textarea
                  rows="2"
                  placeholder="Details..."
                  value={formData.note}
                  onChange={(e) =>
                    setFormData({ ...formData, note: e.target.value })
                  }
                  className="form-input"
                  style={{ resize: "none" }}
                />
              </div>

              <button
                disabled={isCompressing}
                type="submit"
                className="btn btn-primary btn-block"
                style={{ opacity: isCompressing ? 0.5 : 1 }}
              >
                {isCompressing
                  ? "Processing..."
                  : editingId
                  ? "Update"
                  : "Save"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {viewImage && (
        <div className="modal-overlay" onClick={() => setViewImage(null)}>
          <div
            style={{
              position: "relative",
              background: "white",
              padding: "8px",
              borderRadius: "8px",
              maxWidth: "90vw",
              maxHeight: "90vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewImage(null)}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                padding: "8px",
                background: "var(--color-primary)",
                borderRadius: "50%",
                color: "white",
                border: "none",
                cursor: "pointer",
                zIndex: 10,
              }}
            >
              <X size={20} />
            </button>
            <img
              src={viewImage}
              alt="Receipt"
              style={{
                maxWidth: "100%",
                height: "auto",
                display: "block",
                borderRadius: "4px",
              }}
            />
            {viewImage.startsWith("http") && (
              <div style={{ marginTop: "8px", textAlign: "center" }}>
                <a
                  href={viewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{
                    display: "inline-flex",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                  }}
                >
                  <ExternalLink size={16} /> Open in Drive
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
