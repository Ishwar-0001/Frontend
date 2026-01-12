import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import Login from "./auth/Login/Login";
import Dashboard from './auth/dashboard/Dashboard'
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hidden-login" element={<Login />} />
        <Route path="/hidden-dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}
