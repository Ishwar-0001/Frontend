import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  LogOut, 
  Plus, 
  User, 
  Mail, 
  ShieldCheck, 
  X, 
  LayoutDashboard,
  Calendar,
  Hash,
  Gamepad2
} from "lucide-react";
import API_URLS from "../api/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    gameId: "",
    date: "",
    resultNumber: "",
  });

  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/hidden-login");
      return;
    }

    try {
      const res = await axios.get(API_URLS.Auth.userProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.data);
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/hidden-login");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/hidden-login");
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddResult = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // FORMAT DATE: Convert YYYY-MM-DD (input default) to DD-MM-YYYY
    const [year, month, day] = formData.date.split("-");
    const formattedPayload = {
      ...formData,
      date: `${day}-${month}-${year}`
    };

    try {
      await axios.post(API_URLS.GameResults.add, formattedPayload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Game result added successfully!");
      setShowModal(false);
      setFormData({ gameId: "", date: "", resultNumber: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add result");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-500 font-medium">Loading Dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <LayoutDashboard className="text-white w-5 h-5" />
              </div>
              <h1 className="font-bold text-xl tracking-tight text-gray-900">
                Satta<span className="text-indigo-600">Admin</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.firstName}</p>
                <p className="text-xs text-gray-500 capitalize">{user.role} Account</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}! 👋</h2>
            <p className="text-gray-500">Manage your game results and monitor performance.</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            <Plus size={20} />
            Add Game Result
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard 
            label="Email Address" 
            value={user.email} 
            icon={<Mail className="text-blue-500" />} 
          />
          <InfoCard 
            label="Username" 
            value={`@${user.username}`} 
            icon={<User className="text-purple-500" />} 
          />
          <InfoCard
            label="Account Status"
            value={user.isVerified ? "Verified" : "Pending"}
            highlight={user.isVerified}
            icon={<ShieldCheck className={user.isVerified ? "text-green-500" : "text-amber-500"} />}
          />
        </div>

        <div className="mt-10 bg-white border border-gray-200 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Gamepad2 className="text-gray-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No results displayed</h3>
            <p className="text-gray-500 max-w-sm mx-auto">Use the button above to add your first game result for today.</p>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-lg">Add New Result</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddResult} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Game ID</label>
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        name="gameId"
                        placeholder="e.g. 132"
                        value={formData.gameId}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        required
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Result Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        required
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Result Number</label>
                <div className="relative">
                    <Gamepad2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        name="resultNumber"
                        placeholder="e.g. 85"
                        value={formData.resultNumber}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                        required
                    />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                >
                  Save Result
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoCard = ({ label, value, icon, highlight }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-50 rounded-xl">
        {icon}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500 font-bold">{label}</p>
        <p className={`mt-0.5 text-lg font-bold ${highlight ? "text-green-600" : "text-gray-900"}`}>
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default Dashboard;