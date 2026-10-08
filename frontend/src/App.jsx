import { useState } from "react";
import api from "./api";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import FamilyMembers from "./pages/FamilyMembers";
import MedicalClaims from "./pages/MedicalClaims";
import HealthRecords from "./pages/HealthRecords";
import Medicines from "./pages/Medicines";
import MedicalDocuments from "./pages/MedicalDocuments";
import Doctors from "./pages/Doctors";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  const [username, setUsername] = useState("");

  const [currentPage, setCurrentPage] = useState("dashboard");

  // Login
  const handleLogin = (loggedInUsername) => {
    setUsername(loggedInUsername);
    setLoggedIn(true);
    setCurrentPage("dashboard");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    delete api.defaults.headers.common["Authorization"];

    setLoggedIn(false);
    setUsername("");
    setCurrentPage("dashboard");
  };

  // Show Login page if user is not logged in
  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // Dashboard
  if (currentPage === "dashboard") {
    return (
      <Dashboard
        username={username}
        onLogout={handleLogout}
        onNavigate={setCurrentPage}
      />
    );
  }

  // Family Members
  if (currentPage === "family") {
    return <FamilyMembers />;
  }

  // Medical Claims
  if (currentPage === "claims") {
    return <MedicalClaims />;
  }

  // Health Records
  if (currentPage === "health") {
    return <HealthRecords />;
  }

  // Medicines
  if (currentPage === "medicines") {
    return <Medicines />;
  }

  if (currentPage === "doctors") {
  return <Doctors />;
}

  // Medical Documents
  if (currentPage === "documents") {
    return <MedicalDocuments />;
  }

  // Default page
  return (
    <Dashboard
      username={username}
      onLogout={handleLogout}
      onNavigate={setCurrentPage}
    />
  );
}

export default App;