import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Maps from "../pages/Maps";
import Login from "../pages/Login";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}