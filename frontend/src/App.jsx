import { useState } from "react";
import api from "./api";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  const [username, setUsername] = useState("");

  const handleLogin = (loggedInUsername) => {
    setUsername(loggedInUsername);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    delete api.defaults.headers.common["Authorization"];

    setLoggedIn(false);
    setUsername("");
  };

  if (!loggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      username={username}
      onLogout={handleLogout}
    />
  );
}

export default App;