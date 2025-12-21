import React, { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
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
  ShieldAlert,
  ExternalLink,
  MessageSquare,
  HelpCircle,
  Sun,
  Moon,
  Database,
  Link2
} from "lucide-react";

// --- Embedded CSS Styles (Enhanced UX) ---
const styles = `
:root {
  /* Color Palette */
  --color-primary: #1e293b;   /* Slate 800 */
  --color-secondary: #64748b; /* Slate 500 */
  --color-brand: #10b981;     /* Emerald 500 */
  --color-brand-dark: #059669;
  --color-accent: #ef4444;    /* Red 500 */
  
  --color-bg: #f8fafc;        /* Slate 50 */
  --color-surface: #ffffff;
  --color-border: #e2e8f0;    /* Slate 200 */
  
  /* Glass & Overlays */
  --glass-bg: rgba(255, 255, 255, 0.85);
  --glass-border: rgba(255, 255, 255, 0.5);
  --overlay-bg: rgba(15, 23, 42, 0.6); /* Slate 900 with opacity */

  /* Spacing & Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 28px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025);
  --shadow-glow: 0 0 15px rgba(16, 185, 129, 0.3);

  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Dark Mode */
body.dark {
  --color-primary: #f1f5f9;   /* Slate 100 */
  --color-secondary: #94a3b8; /* Slate 400 */
  --color-brand: #34d399;     /* Emerald 400 */
  --color-brand-dark: #10b981;
  --color-accent: #f87171;    /* Red 400 */
  
  --color-bg: #0f172a;        /* Slate 900 */
  --color-surface: #1e293b;   /* Slate 800 */
  --color-border: #334155;    /* Slate 700 */
  
  --glass-bg: rgba(30, 41, 59, 0.85);
  --glass-border: rgba(255, 255, 255, 0.1);
  --overlay-bg: rgba(0, 0, 0, 0.8);
}

* { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }

body {
  background-color: var(--color-bg);
  color: var(--color-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  transition: background-color 0.4s ease, color 0.4s ease;
  line-height: 1.5;
}

.app-container { min-height: 100vh; padding-bottom: 80px; }
.main-layout { max-width: 1200px; margin: 0 auto; padding: 16px; display: flex; flex-direction: column; gap: 1.5rem; }

/* --- Header --- */
.app-header {
  background-color: var(--glass-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  position: sticky; top: 0; z-index: 40;
  transition: var(--transition);
}

.header-content {
  max-width: 1200px; margin: 0 auto; height: 64px; padding: 0 16px;
  display: flex; justify-content: space-between; align-items: center;
}

.brand-logo { display: flex; align-items: center; gap: 10px; }
.logo-icon {
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #fff; padding: 8px;
  border-radius: var(--radius-md); display: flex;
  box-shadow: var(--shadow-glow);
}
.brand-text { font-size: 1.25rem; font-weight: 800; letter-spacing: -0.025em; color: var(--color-primary); }
.brand-text span { color: var(--color-brand); }

.header-actions { display: flex; align-items: center; gap: 8px; }

/* --- Sidebar --- */
.sidebar { display: none; width: 260px; flex-shrink: 0; }

.nav-btn {
  width: 100%; display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border-radius: var(--radius-md); font-weight: 600;
  border: 1px solid transparent; background: transparent;
  color: var(--color-secondary); cursor: pointer;
  transition: var(--transition); text-align: left; margin-bottom: 6px;
}
.nav-btn:hover { background-color: var(--color-surface); color: var(--color-primary); }
.nav-btn.active { 
  background-color: var(--color-surface); 
  color: var(--color-brand); 
  border-color: var(--color-border);
  box-shadow: var(--shadow-sm);
}

/* --- Bottom Nav (Mobile) --- */
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  background-color: var(--glass-bg);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid var(--color-border);
  display: flex; justify-content: space-around; padding: 10px; z-index: 40;
  padding-bottom: max(10px, env(safe-area-inset-bottom));
  box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
}

.bottom-nav-btn {
  display: flex; flex-direction: column; align-items: center;
  background: none; border: none; color: var(--color-secondary);
  opacity: 0.7; font-size: 11px; font-weight: 600; gap: 4px;
  transition: var(--transition);
}
.bottom-nav-btn.active { color: var(--color-brand); opacity: 1; transform: translateY(-2px); }

/* --- Cards --- */
.card {
  background-color: var(--color-surface); 
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md); 
  border: 1px solid var(--color-border);
  overflow: hidden; 
  transition: var(--transition);
}
.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
.card-body { padding: 20px; }

/* --- Dashboard Stats --- */
.stats-grid { display: grid; grid-template-columns: gap: 12px; }
.stat-card { text-align: center; position: relative; overflow: hidden; border: 1px solid var(--color-border); }
.stat-card::after {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
}
.stat-card.lent::after { background: var(--color-primary); }
.stat-card.borrowed::after { background: var(--color-accent); }
.stat-card.net::after { background: var(--color-brand); }

.stat-header { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; margin-bottom: 8px; }
.stat-icon { 
  padding: 8px; border-radius: 50%; display: flex; width: 36px; height: 36px; 
  align-items: center; justify-content: center; 
  background: var(--color-bg);
}
.stat-icon.lent { color: var(--color-primary); }
.stat-icon.borrowed { color: var(--color-accent); }
.stat-icon.net { color: var(--color-brand); }

.stat-label { font-size: 0.7rem; font-weight: 700; color: var(--color-secondary); text-transform: uppercase; letter-spacing: 0.05em; }
.stat-value { font-size: 1.1rem; font-weight: 800; word-break: break-all; }

.split-view { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 16px; }

/* --- Lists & Tables --- */
.search-bar { 
  display: flex; align-items: center; gap: 12px; 
  background-color: var(--color-surface); 
  padding: 12px 16px; border-radius: var(--radius-md); 
  margin-bottom: 16px; border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
}
.search-bar:focus-within {
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px var(--color-brand-fade);
}
.search-input { flex: 1; border: none; outline: none; font-size: 1rem; color: var(--color-primary); background: transparent; }

.desktop-table { width: 100%; border-collapse: separate; border-spacing: 0; display: none; }
.desktop-table th { 
  background-color: var(--color-bg); color: var(--color-secondary); 
  font-weight: 600; text-transform: uppercase; font-size: 0.75rem; 
  letter-spacing: 0.05em; text-align: left; padding: 16px; 
  border-bottom: 1px solid var(--color-border); 
}
.desktop-table td { padding: 16px; border-bottom: 1px solid var(--color-border); color: var(--color-primary); }
.desktop-table tr:last-child td { border-bottom: none; }
.desktop-table tr:hover td { background-color: var(--color-bg); }

.mobile-list { display: flex; flex-direction: column; gap: 12px; }
.transaction-card { padding: 16px; border-radius: var(--radius-md); }
.trans-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.trans-name { font-weight: 700; font-size: 1.05rem; color: var(--color-primary); }
.trans-date { font-size: 0.75rem; color: var(--color-secondary); font-weight: 500; }
.trans-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--color-border); }
.trans-actions { display: flex; gap: 8px; }

.icon-btn { 
  padding: 8px; border-radius: var(--radius-sm); border: 1px solid transparent; 
  background-color: var(--color-bg); cursor: pointer; display: flex; 
  color: var(--color-secondary); transition: var(--transition);
}
.icon-btn:hover { background-color: var(--color-surface); border-color: var(--color-border); transform: scale(1.05); }
.icon-btn.delete:hover { color: var(--color-accent); background-color: var(--color-accent-fade); border-color: transparent; }
.icon-btn.edit:hover { color: var(--color-primary); }
.icon-btn.view:hover { color: var(--color-brand); background-color: var(--color-brand-fade); border-color: transparent; }

.badge { 
  display: inline-flex; align-items: center; padding: 4px 10px; 
  border-radius: 99px; font-size: 0.65rem; font-weight: 700; 
  text-transform: uppercase; letter-spacing: 0.05em;
}
.badge.lent { background-color: var(--color-primary); color: #fff; }
.badge.borrowed { background-color: var(--color-accent); color: #fff; }

.text-primary { color: var(--color-primary); }
.text-brand { color: var(--color-brand); }
.text-accent { color: var(--color-accent); }

/* --- Buttons --- */
.btn { 
  display: inline-flex; align-items: center; gap: 8px; 
  padding: 10px 16px; border-radius: var(--radius-md); 
  font-weight: 600; border: none; cursor: pointer; 
  transition: var(--transition); font-size: 0.9rem;
  justify-content: center;
}
.btn:active { transform: scale(0.98); }

.btn-ghost { background: transparent; color: var(--color-secondary); }
.btn-ghost:hover { background-color: var(--color-bg); color: var(--color-primary); }

.btn-primary { 
  background: linear-gradient(135deg, var(--color-brand), var(--color-brand-dark));
  color: #ffffff; 
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
}
.btn-primary:hover { 
  opacity: 0.95; 
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35); 
  transform: translateY(-1px);
}
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; box-shadow: none; }

.btn-block { width: 100%; padding: 14px; font-size: 1rem; }

/* --- Modal --- */
.modal-overlay { 
  position: fixed; inset: 0; background-color: var(--overlay-bg); 
  backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
  z-index: 50; display: flex; justify-content: center; align-items: flex-end; 
  animation: fadeIn 0.2s ease-out;
}
.modal-content { 
  background-color: var(--color-surface); width: 100%; max-width: 500px; 
  max-height: 90vh; 
  border-radius: var(--radius-xl) var(--radius-xl) 0 0; 
  display: flex; flex-direction: column; 
  box-shadow: 0 -10px 40px rgba(0,0,0,0.2);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-header { 
  padding: 20px; background-color: var(--color-surface); 
  color: var(--color-primary); 
  border-bottom: 1px solid var(--color-border);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0; 
  display: flex; justify-content: space-between; align-items: center; 
}
.modal-body { padding: 24px; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; }

/* --- Forms --- */
.form-group { margin-bottom: 0; }
.form-label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--color-secondary); margin-bottom: 8px; }
.form-input { 
  width: 100%; padding: 14px; border-radius: var(--radius-md); 
  background-color: var(--color-bg); border: 2px solid transparent; 
  font-size: 1rem; font-weight: 500; color: var(--color-primary); 
  outline: none; transition: var(--transition);
}
.form-input:focus { 
  background-color: var(--color-surface); 
  border-color: var(--color-brand); 
  box-shadow: 0 0 0 4px var(--color-brand-fade);
}

.toggle-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--color-bg); padding: 4px; border-radius: var(--radius-md); }
.toggle-btn { 
  padding: 12px; border-radius: var(--radius-sm); border: none; 
  font-weight: 600; cursor: pointer; background: transparent; 
  color: var(--color-secondary); transition: var(--transition);
}
.toggle-btn:hover { color: var(--color-primary); }
.toggle-btn.active-lent { background-color: var(--color-surface); color: var(--color-primary); box-shadow: var(--shadow-sm); }
.toggle-btn.active-borrowed { background-color: var(--color-accent); color: #fff; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3); }

.file-drop { 
  border: 2px dashed var(--color-border); border-radius: var(--radius-md); 
  padding: 24px; text-align: center; cursor: pointer; position: relative; 
  background-color: var(--color-bg); transition: var(--transition);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.file-drop:hover { border-color: var(--color-brand); background-color: var(--color-brand-fade); }

.autocomplete-list { 
  position: absolute; top: 100%; left: 0; right: 0; 
  background: var(--color-surface); border: 1px solid var(--color-border); 
  border-radius: var(--radius-md); box-shadow: var(--shadow-lg); 
  z-index: 20; max-height: 220px; overflow-y: auto; margin-top: 6px; 
  list-style: none; padding: 4px;
}
.autocomplete-item { 
  padding: 12px 16px; cursor: pointer; display: flex; align-items: center; gap: 10px; 
  border-radius: var(--radius-sm); color: var(--color-primary); 
  transition: var(--transition);
}
.autocomplete-item:hover { background-color: var(--color-bg); }

/* --- Toast --- */
.toast { 
  position: fixed; top: 20px; left: 50%; transform: translateX(-50%); 
  padding: 12px 20px; border-radius: 99px; color: #ffffff; 
  display: flex; align-items: center; gap: 10px; 
  box-shadow: var(--shadow-lg); z-index: 100; 
  animation: slideDownFade 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  font-weight: 500; font-size: 0.9rem; min-width: 300px; justify-content: center;
}
.toast.success { background-color: var(--color-primary); }
.toast.error { background-color: var(--color-accent); }

/* --- Animations --- */
.spinner { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideDownFade { from { opacity: 0; transform: translate(-50%, -20px); } to { opacity: 1; transform: translate(-50%, 0); } }

.hidden-mobile { display: none; }
.hidden-desktop { display: block; }

/* --- Desktop Overrides --- */
@media (min-width: 768px) {
  .app-container { padding-bottom: 0; background-color: var(--color-bg); }
  .main-layout { flex-direction: row; padding: 40px 20px; gap: 2.5rem; }
  .header-content { height: 72px; padding: 0 24px; }
  .sidebar { display: block; }
  .bottom-nav { display: none; }
  
  .stats-grid { gap: 20px; }
  .stat-card { border-left: 4px solid; border-top: 1px solid var(--color-border); text-align: left; padding: 4px; }
  .stat-header { flex-direction: row; justify-content: flex-start; gap: 16px; margin-bottom: 12px; }
  .stat-icon { width: 48px; height: 48px; padding: 10px; }
  .stat-label { font-size: 0.8rem; }
  .stat-value { font-size: 1.75rem; }
  
  .split-view { gap: 24px; }
  .desktop-table { display: table; }
  .mobile-list { display: none; }
  
  .hidden-mobile { display: block; }
  .hidden-desktop { display: none; }
  
  .modal-overlay { align-items: center; }
  .modal-content { border-radius: var(--radius-lg); height: auto; max-width: 550px; }
}
`;

// ... [Helper functions remain exactly the same] ...
const base64ToBlob = (base64) => {
  const parts = base64.split(";base64,");
  const contentType = parts[0].split(":")[1];
  const raw = window.atob(parts[1]);
  const rawLength = raw.length;
  const uInt8Array = new Uint8Array(rawLength);
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  return new Blob([uInt8Array], { type: contentType });
};

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
        const maxWidth = 800;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

const useExternalScripts = () => {
  const [isXLSXLoaded, setIsXLSXLoaded] = useState(false);
  useEffect(() => {
    if (window.XLSX) setIsXLSXLoaded(true);
    else {
      const script = document.createElement("script");
      script.src = "https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js";
      script.async = true;
      script.onload = () => setIsXLSXLoaded(true);
      document.body.appendChild(script);
    }
  }, []);
  return { isXLSXLoaded };
};

export default function App() {
  const { isXLSXLoaded } = useExternalScripts();

  // --- Supabase State ---

  // --- Supabase State ---
  const [supabaseUrl, setSupabaseUrl] = useState(localStorage.getItem("sb_url") || import.meta.env.VITE_SUPABASE_URL);
  const [supabaseKey, setSupabaseKey] = useState(localStorage.getItem("sb_key") || import.meta.env.VITE_SUPABASE_ANON_KEY);
  const [supabase, setSupabase] = useState(null);

  // --- App State ---
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [viewImage, setViewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [personFilter, setPersonFilter] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("app_theme") || "light");
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

  // Init Supabase
  useEffect(() => {
    if (supabaseUrl && supabaseKey) {
      try {
        const client = createClient(supabaseUrl, supabaseKey);
        setSupabase(client);
        localStorage.setItem("sb_url", supabaseUrl);
        localStorage.setItem("sb_key", supabaseKey);
      } catch (e) {
        console.error("Invalid Supabase Config");
      }
    }
  }, [supabaseUrl, supabaseKey]);

  // Load local data
  useEffect(() => {
    const saved = localStorage.getItem("ledger_data");
    if (saved) {
      try { setTransactions(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // Fetch initial
  useEffect(() => {
    if (supabase) {
      fetchTransactions();
    }
  }, [supabase]);

  // Save local
  useEffect(() => {
    localStorage.setItem("ledger_data", JSON.stringify(transactions));
  }, [transactions]);

  // Theme
  useEffect(() => {
    if (theme === "dark") document.body.classList.add("dark");
    else document.body.classList.remove("dark");
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nameInputRef.current && !nameInputRef.current.contains(event.target)) {
        setShowNameSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showNotify = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // --- Supabase Operations ---
  const fetchTransactions = async () => {
    if (!supabase) return;
    setIsProcessing(true);
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });
      
      if (error) throw error;
      if (data) setTransactions(data);
    } catch (error) {
      console.error("Fetch Error:", error);
      showNotify("Fetched local data (Cloud sync failed)", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const pushLocalToSupabase = async () => {
    if (!supabase) return showNotify("Configure Supabase first", "error");
    if (transactions.length === 0) return showNotify("No local data to push", "error");
    
    setIsProcessing(true);
    try {
      const payload = transactions.map(t => ({
        id: t.id,
        date: t.date,
        name: t.name,
        mobile: t.mobile,
        amount: t.amount,
        type: t.type,
        note: t.note,
        image: t.image && t.image.startsWith('http') ? t.image : null 
      }));

      const { error } = await supabase.from("transactions").upsert(payload);
      if (error) throw error;
      showNotify("Local data pushed to cloud!");
    } catch(err) {
      showNotify("Push failed: " + err.message, "error");
    } finally {
      setIsProcessing(false);
    }
  }

  const uploadImageToSupabase = async (base64Image, fileName) => {
    if (!supabase) return null;
    try {
      const blob = base64ToBlob(base64Image);
      const filePath = `public/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from("receipts")
        .upload(filePath, blob, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("receipts").getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Image Upload Error:", error);
      return null;
    }
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.amount) return;

    setIsProcessing(true);
    const amountVal = parseFloat(formData.amount);
    const tempId = editingId || Date.now();
    let imageUrl = formData.image;

    if (formData.image && formData.image.startsWith("data:") && supabase) {
      const fileName = `${Date.now()}_${formData.name.replace(/\s+/g, "")}.jpg`;
      const uploadedUrl = await uploadImageToSupabase(formData.image, fileName);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const transactionData = {
      id: tempId,
      date: formData.date,
      name: formData.name,
      mobile: formData.mobile,
      amount: amountVal,
      type: formData.type,
      note: formData.note,
      image: imageUrl
    };

    if (editingId) {
      setTransactions(prev => prev.map(t => t.id === editingId ? transactionData : t));
    } else {
      setTransactions(prev => [transactionData, ...prev]);
    }

    if (supabase) {
      try {
        const { error } = await supabase.from("transactions").upsert(transactionData); 
        if (error) throw error;
      } catch (error) {
        showNotify("Saved locally. Sync failed.", "error");
      }
    }

    setIsProcessing(false);
    showNotify(editingId ? "Transaction updated" : "Transaction added");
    closeModal();
  };

  const deleteTransaction = async (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (supabase) {
      try {
        const { error } = await supabase.from("transactions").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        showNotify("Deleted locally. Sync failed.", "error");
      }
    }
    showNotify("Transaction deleted");
  };

  const handleFileUpload = (e) => {
    if (!isXLSXLoaded) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
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

        setTransactions((prev) => [...normalizedData, ...prev]);
        
        if (supabase) {
             const { error } = await supabase.from('transactions').upsert(normalizedData);
             if(error) {
                 showNotify(`${normalizedData.length} records imported locally (Sync Failed).`, "error");
             } else {
                 showNotify(`${normalizedData.length} records imported & synced!`);
             }
        } else {
            showNotify(`${normalizedData.length} records imported locally.`);
        }
        
      } catch (err) {
        showNotify("Error reading file.", "error");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (!isXLSXLoaded) return;
    const ws = window.XLSX.utils.json_to_sheet(transactions);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Ledger");
    window.XLSX.writeFile(wb, `Ledger_${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const compressed = await compressImage(file);
      setFormData(prev => ({ ...prev, image: compressed }));
    } catch { showNotify("Image error", "error"); }
    finally { setIsProcessing(false); }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingId(null);
    setFormData({ date: new Date().toISOString().split("T")[0], name: "", mobile: "", amount: "", type: "lent", note: "", image: null });
  };

  const openEditModal = (t) => {
    setFormData({ ...t });
    setEditingId(t.id);
    setShowAddModal(true);
  };

  const stats = useMemo(() => {
    let lent = 0, borrowed = 0;
    transactions.forEach(t => t.type === "lent" ? lent += t.amount : borrowed += t.amount);
    return { lent, borrowed, net: lent - borrowed };
  }, [transactions]);

  const peopleSummary = useMemo(() => {
    const people = {};
    transactions.forEach(t => {
      const name = t.name.trim();
      if (!people[name]) people[name] = { balance: 0, mobile: t.mobile || "" };
      t.type === "lent" ? people[name].balance += t.amount : people[name].balance -= t.amount;
    });
    return Object.entries(people)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
  }, [transactions]);

  const filteredTransactions = transactions
    .filter(t => 
      (t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.note.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!personFilter || t.name.trim() === personFilter)
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const sendWhatsAppReport = (personName, personMobile) => {
    if (!personMobile) return showNotify("No mobile number", "error");
    const personTransactions = transactions.filter((t) => t.name.trim() === personName);
    let total = 0;
    let message = `*Report for ${personName}*\n\n`;
    personTransactions.forEach((t, i) => {
      total += t.type === 'lent' ? t.amount : -t.amount;
      message += `${i+1}. ${t.date}: ${t.type === 'lent' ? '🔴 Given' : '🟢 Rec'} ₹${t.amount}\n`;
    });
    message += `\n*Net Balance: ${total >= 0 ? 'You Get' : 'You Give'} ₹${Math.abs(total)}*`;
    window.open(`https://wa.me/${personMobile.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="app-container">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      {notification && <div className={`toast ${notification.type === 'error' ? 'error' : 'success'}`}>{notification.msg}</div>}

      <header className="app-header">
        <div className="header-content">
          <div className="brand-logo">
            <div className="logo-icon"><FileSpreadsheet size={20} /></div>
            <h1 className="brand-text">Ledger<span>Link</span></h1>
          </div>
          <div className="header-actions">
            <button onClick={toggleTheme} className="btn btn-ghost" title="Toggle Theme">{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => setShowSyncModal(true)} className="btn btn-ghost" title="Connection Settings">
              <Cloud size={20} className={supabase ? "text-brand" : "text-secondary"} />
            </button>
            
            <div className="hidden-mobile" style={{ position: "relative", display: "inline-block" }}>
              <button className="btn btn-ghost" title="Import Excel/CSV">
                <Upload size={20} />
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
              </button>
            </div>

            <button onClick={handleExport} className="btn btn-ghost hidden-mobile" title="Export Excel"><Download size={20} /></button>
            <button onClick={() => setShowAddModal(true)} className="btn btn-primary"><Plus size={18} /><span className="hidden-mobile">Add</span></button>
          </div>
        </div>
      </header>

      <div className="main-layout">
        <nav className="sidebar">
          {["dashboard", "transactions", "people"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`nav-btn ${activeTab === tab ? "active" : ""}`}>
              {tab === "dashboard" && <Wallet size={20} />}
              {tab === "transactions" && <History size={20} />}
              {tab === "people" && <Users size={20} />}
              {tab}
            </button>
          ))}
          <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--color-border)" }}>
             <button className="nav-btn" style={{ position: "relative" }}>
                <Upload size={20} /> Import CSV/Excel
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
             </button>
             <button onClick={handleExport} className="nav-btn"><Download size={20} /> Export Excel</button>
             <button onClick={() => setShowSyncModal(true)} className="nav-btn"><Settings size={20} /> Connection</button>
          </div>
        </nav>

        <main style={{ flex: 1 }}>
          {activeTab === "dashboard" && (
            <div className="stats-grid">
               <div className="card stat-card lent"><div className="card-body"><div className="stat-header"><div className="stat-icon lent"><ArrowUpRight /></div><span className="stat-label">Lent</span></div><div className="stat-value text-primary">₹{stats.lent.toLocaleString()}</div></div></div>
               <div className="card stat-card borrowed"><div className="card-body"><div className="stat-header"><div className="stat-icon borrowed"><ArrowDownLeft /></div><span className="stat-label">Borrowed</span></div><div className="stat-value text-accent">₹{stats.borrowed.toLocaleString()}</div></div></div>
               <div className="card stat-card net"><div className="card-body"><div className="stat-header"><div className="stat-icon net"><Wallet /></div><span className="stat-label">Net Balance</span></div><div className={`stat-value ${stats.net >= 0 ? "text-brand" : "text-accent"}`}>{stats.net >= 0 ? "+" : ""}₹{Math.abs(stats.net).toLocaleString()}</div></div></div>
            </div>
          )}

          {activeTab === "transactions" && (
            <div>
              {personFilter && <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', background: 'var(--color-surface)', padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', alignItems: 'center' }}><span style={{fontSize: '0.9rem'}}>Filtered by: <strong className="text-primary">{personFilter}</strong></span><button onClick={() => setPersonFilter(null)} className="btn btn-ghost" style={{padding: '6px'}}><X size={16} /></button></div>}
              
              <div className="search-bar">
                <Search size={18} className="text-secondary" />
                <input type="text" placeholder="Search transactions..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="search-input" />
              </div>
              
              {/* Desktop Table View */}
              <div className="card hidden-mobile" style={{ overflowX: 'auto' }}>
                <table className="desktop-table">
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}>Date</th>
                      <th>Person</th>
                      <th style={{ width: '100px' }}>Type</th>
                      <th style={{ textAlign: "right", width: '120px' }}>Amount</th>
                      <th>Note</th>
                      <th style={{ textAlign: "right", width: '100px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((t) => (
                      <tr key={t.id}>
                        <td>{t.date}</td>
                        <td className="text-primary" style={{ fontWeight: "600" }}>{t.name}</td>
                        <td><span className={`badge ${t.type}`}>{t.type === "lent" ? "Lent" : "Borrowed"}</span></td>
                        <td className={t.type === "lent" ? "text-primary" : "text-accent"} style={{ textAlign: "right", fontWeight: "700" }}>₹{t.amount.toLocaleString()}</td>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {t.note && <span style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: "0.9rem", color: "var(--color-secondary)" }}>{t.note}</span>}
                            {t.image && <button onClick={() => setViewImage(t.image)} className="icon-btn view" title="View Receipt"><Eye size={14} /></button>}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: "flex", justifyContent: "flex-end", gap: "6px" }}>
                            <button onClick={() => openEditModal(t)} className="icon-btn edit" title="Edit"><Edit2 size={16} /></button>
                            <button onClick={() => deleteTransaction(t.id)} className="icon-btn delete" title="Delete"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredTransactions.length === 0 && (
                      <tr><td colSpan="6" style={{ textAlign: "center", padding: "40px", color: "var(--color-secondary)" }}>No transactions found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="mobile-list hidden-desktop">
                {filteredTransactions.map(t => (
                  <div key={t.id} className="card transaction-card">
                    <div className="trans-header">
                      <div style={{display:'flex', alignItems:'center', gap: '8px'}}>
                        <span className="trans-name">{t.name}</span> 
                        {t.image && <div style={{ color: 'var(--color-brand)', display:'flex' }}><ImageIcon size={14} /></div>}
                      </div>
                      <span className={`badge ${t.type}`}>{t.type === 'lent' ? 'Lent' : 'Borrowed'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <div>
                        <span className="trans-date">{t.date}</span>
                        {t.note && <div style={{ fontSize: '0.85rem', color: 'var(--color-secondary)', marginTop: '4px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.note}</div>}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem' }} className={t.type === 'lent' ? "text-primary" : "text-accent"}>₹{t.amount.toLocaleString()}</span>
                    </div>
                    <div className="trans-footer">
                      <div className="trans-actions" style={{ marginLeft: 'auto' }}>
                         <button onClick={() => openEditModal(t)} className="icon-btn edit"><Edit2 size={16} /></button>
                         <button onClick={() => deleteTransaction(t.id)} className="icon-btn delete"><Trash2 size={16} /></button>
                         {t.image && <button onClick={() => setViewImage(t.image)} className="icon-btn view"><Eye size={16} /></button>}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredTransactions.length === 0 && (
                   <div style={{ textAlign: "center", padding: "40px", color: "var(--color-secondary)" }}>No transactions found.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "people" && (
            <div className="stats-grid">
              {peopleSummary.map((p, idx) => (
                <div key={idx} className="card stat-card" style={{ cursor: 'pointer', padding: '16px' }} onClick={() => { setPersonFilter(p.name); setActiveTab('transactions'); }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: p.balance >= 0 ? 'var(--color-primary)' : 'var(--color-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    {p.mobile && <button onClick={(e) => { e.stopPropagation(); sendWhatsAppReport(p.name, p.mobile); }} className="icon-btn view"><MessageSquare size={16}/></button>}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--color-primary)', marginBottom: '4px' }}>{p.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-secondary)', marginBottom: '8px' }}>Net Balance</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800' }} className={p.balance >= 0 ? "text-primary" : "text-accent"}>
                    {p.balance >= 0 ? "+" : ""}₹{p.balance.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <div className="bottom-nav">
        {["dashboard", "transactions", "people"].map(tab => (
           <button key={tab} onClick={() => setActiveTab(tab)} className={`bottom-nav-btn ${activeTab === tab ? "active" : ""}`}>
             {tab === "dashboard" ? <Wallet size={20} /> : tab === "transactions" ? <History size={20} /> : <Users size={20} />}
             <span style={{ textTransform: 'uppercase' }}>{tab}</span>
           </button>
        ))}
      </div>

      {showSyncModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontWeight: '700' }}>Connection Settings</h3>
              <button onClick={() => setShowSyncModal(false)} className="btn btn-ghost"><X size={24} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Supabase URL</label>
                <input type="text" value={supabaseUrl} onChange={e => setSupabaseUrl(e.target.value)} className="form-input" placeholder="https://xyz.supabase.co" />
              </div>
              <div className="form-group">
                <label className="form-label">Supabase Anon Key</label>
                <input type="password" value={supabaseKey} onChange={e => setSupabaseKey(e.target.value)} className="form-input" placeholder="eyJh..." />
              </div>
              <div style={{ background: 'var(--color-bg)', padding: '12px', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--color-secondary)', display: 'flex', gap: '8px' }}>
                <ShieldAlert size={18} style={{ flexShrink: 0, color: 'var(--color-brand)' }} />
                <span>Your Anon Key acts as your password. Ensure your RLS policies are set up correctly in Supabase.</span>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button onClick={fetchTransactions} className="btn btn-primary" style={{ flex: 1 }} disabled={isProcessing || !supabaseUrl || !supabaseKey}>
                   {isProcessing ? <RefreshCw className="spinner" size={18} /> : <Cloud size={18} />} 
                   {isProcessing ? " Syncing..." : " Connect & Pull"}
                </button>
                <button onClick={pushLocalToSupabase} className="btn" style={{ flex: 1, background: 'var(--color-surface)', border: '1px solid var(--color-border)' }} disabled={isProcessing || !supabaseUrl || !supabaseKey}>
                   <Upload size={18} /> Push Local
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3 style={{ fontWeight: '700' }}>{editingId ? "Edit Transaction" : "New Transaction"}</h3>
              <button onClick={closeModal} className="btn btn-ghost"><X size={24} /></button>
            </div>
            <form onSubmit={handleSaveTransaction} className="modal-body">
               <div className="form-group" style={{ position: 'relative' }} ref={nameInputRef}>
                 <label className="form-label">Who?</label>
                 <input type="text" required placeholder="Name..." value={formData.name} onChange={e => { setFormData({...formData, name: e.target.value}); setShowNameSuggestions(true); }} onFocus={() => setShowNameSuggestions(true)} className="form-input" />
                 <ChevronDown size={16} style={{ position: 'absolute', right: '12px', top: '42px', color: 'var(--color-secondary)', pointerEvents: 'none' }} />
                 {showNameSuggestions && (
                   <ul className="autocomplete-list">
                     {[...new Set(transactions.map(t => t.name))].filter(n => n.toLowerCase().includes(formData.name.toLowerCase())).map(n => (
                       <li key={n} onMouseDown={() => { setFormData({...formData, name: n}); setShowNameSuggestions(false); }} className="autocomplete-item">
                         <div style={{ width: '24px', height: '24px', background: 'var(--color-primary)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>{n.charAt(0)}</div>
                         {n}
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
               <div className="form-group">
                 <label className="form-label">Mobile (Optional)</label>
                 <input type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="form-input" placeholder="+91..." />
               </div>
               <div className="toggle-group">
                 <button type="button" onClick={() => setFormData({...formData, type: "lent"})} className={`toggle-btn ${formData.type === "lent" ? "active-lent" : ""}`}>Lent (In)</button>
                 <button type="button" onClick={() => setFormData({...formData, type: "borrowed"})} className={`toggle-btn ${formData.type === "borrowed" ? "active-borrowed" : ""}`}>Borrowed (Out)</button>
               </div>
               <div className="toggle-group">
                  <div><label className="form-label">Amount</label><input type="number" required value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="form-input" placeholder="0.00" /></div>
                  <div><label className="form-label">Date</label><input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="form-input" /></div>
               </div>
               <div className="form-group">
                  <label className="form-label">Receipt</label>
                  <div className="file-drop">
                    <input type="file" accept="image/*" onChange={handleImageSelect} style={{ position: 'absolute', inset: 0, opacity: 0 }} />
                    {formData.image ? 
                      <div style={{ color: 'var(--color-brand)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Check size={20}/> Receipt Attached</div> : 
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: 'var(--color-secondary)' }}>
                        <ImageIcon size={24} style={{ marginBottom: '4px' }} />
                        <span style={{ fontSize: '0.85rem' }}>Tap to upload image</span>
                      </div>
                    }
                  </div>
               </div>
               <div className="form-group">
                 <label className="form-label">Note</label>
                 <textarea value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} className="form-input" rows="2" placeholder="Details..." />
               </div>
               <button type="submit" disabled={isProcessing} className="btn btn-primary btn-block" style={{ marginTop: '10px' }}>
                 {isProcessing ? <RefreshCw className="spinner" /> : (editingId ? <Check /> : <Plus />)} 
                 {isProcessing ? " Saving..." : (editingId ? "Update Transaction" : "Save Transaction")}
               </button>
            </form>
          </div>
        </div>
      )}

      {viewImage && (
        <div className="modal-overlay" onClick={() => setViewImage(null)} style={{ background: 'rgba(0,0,0,0.9)' }}>
           <div style={{ position: 'relative', maxWidth: '95%', maxHeight: '95%' }}>
             <button onClick={() => setViewImage(null)} style={{ position: 'absolute', top: '-40px', right: '0', background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={32} /></button>
             <img src={viewImage} style={{ maxWidth: '100%', maxHeight: '85vh', borderRadius: '8px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
           </div>
        </div>
      )}
    </div>
  );
}