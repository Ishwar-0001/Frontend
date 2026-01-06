import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import LoginHome from "./auth/LoginHome";
import Login from "./auth/Login/Login";
import Register from "./auth/Register/Register";
import Forget from "./auth/Forget/Forget";
import Reset from "./auth/Reset/Reset";
import Dashboard from './dashboard/Dashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hidden" element={<LoginHome />} />
        <Route path="/hidden-login" element={<Login />} />
        <Route path="/hidden-register" element={<Register/>} />
        <Route path="/hidden-forgot-password" element={<Forget />} />
        <Route path="/hidden-reset" element={<Reset/>} />
        <Route path="/hidden-dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}
