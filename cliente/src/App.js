// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/Register";
import Principal from "./pages/Principal";
import EditProfile from './pages/EditProfile';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rota principal unificada */}
        <Route 
          path="/principal/:movieId?" 
          element={<ProtectedRoute><Principal /></ProtectedRoute>} 
        />

        <Route 
          path="/edit-profile" 
          element={<ProtectedRoute><EditProfile /></ProtectedRoute>}
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;