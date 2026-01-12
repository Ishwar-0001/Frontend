import { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, RefreshCw, Calendar, Hash, Table as TableIcon, CheckCircle2 } from "lucide-react";
import api from "../../api/api"; 
const Dashboard = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States for Add/Update
  const [formData, setFormData] = useState({ date: "", number: "" });
  const [editData, setEditData] = useState({ date: "", number: "" });

  // Fetch all data using your real API import
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(api.DateNumber.getAll, { withCredentials: true });
      setList(res.data.data || []);
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(api.DateNumber.add, formData, { withCredentials: true });
      setFormData({ date: "", number: "" });
      fetchData();
    } catch (err) { alert("Error adding data"); }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Using your dynamic update function: api.DateNumber.update(date)
      await axios.put(api.DateNumber.update(editData.date), 
        { number: editData.number }, 
        { withCredentials: true }
      );
      setEditData({ date: "", number: "" });
      fetchData();
    } catch (err) { alert("Error updating data"); }
  };

  return (
    <div style={dashStyles.container}>
      {/* Sidebar / Controls */}
      <aside style={dashStyles.sidebar}>
        <div style={dashStyles.brand}>
          <TableIcon size={24} color="#4f46e5" />
          <h2 style={dashStyles.brandName}>Data Manager</h2>
        </div>

        {/* Form: Add */}
        <div style={dashStyles.section}>
          <h3 style={dashStyles.sectionTitle}><PlusCircle size={16} /> New Entry</h3>
          <form onSubmit={handleAdd} style={dashStyles.form}>
            <input
              style={dashStyles.input}
              placeholder="DD-MM-YYYY"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              required
            />
            <input
              style={dashStyles.input}
              placeholder="Value/Number"
              value={formData.number}
              onChange={(e) => setFormData({...formData, number: e.target.value})}
              required
            />
            <button style={dashStyles.primaryBtn}>Create Record</button>
          </form>
        </div>

        {/* Form: Update */}
        <div style={dashStyles.section}>
          <h3 style={dashStyles.sectionTitle}><RefreshCw size={16} /> Update Existing</h3>
          <form onSubmit={handleUpdate} style={dashStyles.form}>
            <input
              style={dashStyles.input}
              placeholder="Date to match"
              value={editData.date}
              onChange={(e) => setEditData({...editData, date: e.target.value})}
              required
            />
            <input
              style={dashStyles.input}
              placeholder="New Value"
              value={editData.number}
              onChange={(e) => setEditData({...editData, number: e.target.value})}
              required
            />
            <button style={dashStyles.secondaryBtn}>Update Entry</button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={dashStyles.main}>
        <header style={dashStyles.mainHeader}>
          <div>
            <h1 style={dashStyles.mainTitle}>Analytics Dashboard</h1>
            <p style={dashStyles.mainSubtitle}>Overview of all recorded date-number entries</p>
          </div>
          <button onClick={fetchData} style={dashStyles.refreshBtn}>
            <RefreshCw size={18} className={loading ? "spin" : ""} />
          </button>
        </header>

        <div style={dashStyles.tableContainer}>
          <table style={dashStyles.table}>
            <thead>
              <tr>
                <th style={dashStyles.th}><Calendar size={14} /> Date</th>
                <th style={dashStyles.th}><Hash size={14} /> Recorded Number</th>
                <th style={dashStyles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr key={item._id || idx} style={dashStyles.tr}>
                  <td style={dashStyles.td}>{item.date}</td>
                  <td style={dashStyles.td}>
                    <span style={dashStyles.numberBadge}>{item.number}</span>
                  </td>
                  <td style={dashStyles.td}>
                    <span style={dashStyles.status}><CheckCircle2 size={14} /> Active</span>
                  </td>
                </tr>
              ))}
              {list.length === 0 && !loading && (
                <tr>
                  <td colSpan="3" style={dashStyles.empty}>No data found. Add an entry to start.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// --- MODERN UI STYLES ---
const dashStyles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: "300px",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e2e8f0",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "30px",
  },
  brand: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" },
  brandName: { fontSize: "20px", fontWeight: "800", color: "#1e293b", margin: 0 },
  section: { display: "flex", flexDirection: "column", gap: "12px" },
  sectionTitle: { fontSize: "12px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "8px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
  },
  primaryBtn: {
    padding: "10px",
    backgroundColor: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px",
    backgroundColor: "#f1f5f9",
    color: "#475569",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  main: { flex: 1, padding: "40px", overflowY: "auto" },
  mainHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  mainTitle: { fontSize: "28px", fontWeight: "800", color: "#1e293b", margin: 0 },
  mainSubtitle: { color: "#64748b", margin: "5px 0 0 0" },
  refreshBtn: { padding: "10px", borderRadius: "50%", border: "1px solid #e2e8f0", backgroundColor: "white", cursor: "pointer", display: "flex", alignItems: "center" },
  tableContainer: { backgroundColor: "white", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e2e8f0", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: { padding: "16px", backgroundColor: "#f8fafc", color: "#64748b", fontSize: "13px", fontWeight: "600", borderBottom: "1px solid #e2e8f0" },
  tr: { borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" },
  td: { padding: "16px", fontSize: "14px", color: "#334155" },
  numberBadge: { padding: "4px 10px", backgroundColor: "#eef2ff", color: "#4f46e5", borderRadius: "20px", fontWeight: "700", fontSize: "12px" },
  status: { color: "#10b981", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" },
  empty: { padding: "40px", textAlign: "center", color: "#94a3b8" }
};

export default Dashboard;