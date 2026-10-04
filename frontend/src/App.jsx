import { useState } from "react";
import api from "./api";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FamilyMembers from "./pages/FamilyMembers";
import MedicalClaims from "./pages/MedicalClaims";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  const [username, setUsername] = useState("");

  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = (loggedInUsername) => {
    setUsername(loggedInUsername);
    setLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    delete api.defaults.headers.common["Authorization"];

    setLoggedIn(false);
    setUsername("");
    setCurrentPage("dashboard");
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === "family") {
    return (
      <FamilyMembers />
    );
  }
  if (currentPage === "claims") {
  return (
    <MedicalClaims />
  );
}

  return (
    <Dashboard
      username={username}
      onLogout={handleLogout}
      onNavigate={setCurrentPage}
    />
  );
}

export default App;